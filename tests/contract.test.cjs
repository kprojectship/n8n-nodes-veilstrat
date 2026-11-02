const assert = require('node:assert/strict');
const test = require('node:test');
const { Expression } = require('n8n-workflow');
const { Veilstrat } = require('../dist/nodes/Veilstrat/Veilstrat.node.js');
const { VeilstratApi } = require('../dist/credentials/VeilstratApi.credentials.js');
const { validateRequest } = require('../dist/nodes/Veilstrat/validation.js');
const node = new Veilstrat().description;
const expression = new Expression('UTC');
const nodeInfo = {
	id: 'test',
	name: 'VeilStrat',
	type: 'n8n-nodes-veilstrat.veilstrat',
	typeVersion: 1,
	position: [0, 0],
	parameters: {},
};
function context(parameters) {
	return {
		getNode: () => nodeInfo,
		getNodeParameter: (name, fallback) => (name in parameters ? parameters[name] : fallback),
	};
}
function resolve(value, data = {}) {
	return expression.resolveSimpleParameterValue(value, data);
}
const parameters = {
	resource: 'company',
	operation: 'search',
	signalQuery: 'signal:hiring:30d',
	countries: ' us, GB ',
	page: 1,
	pageSize: 10,
};

test('all six operations use the published VeilStrat API contract', () => {
	assert.equal(node.requestDefaults.baseURL, 'https://app.veilstrat.com/api/v1');
	const operations = node.properties.filter((p) => p.name === 'operation');
	const actual = operations.flatMap((p) =>
		p.options.map((o) => [o.routing.request.method, o.routing.request.url]),
	);
	assert.deepEqual(actual, [
		['GET', '=/companies/{{encodeURIComponent($parameter.companyId.trim())}}'],
		['POST', '/companies'],
		['GET', '/slices'],
		['GET', '/filters'],
		['GET', '/health'],
		['GET', '/stats'],
	]);
	assert.ok(!JSON.stringify(node).includes('paginate'));
});

test('n8n expression engine produces the documented search body and slice query', () => {
	for (const resource of ['company', 'signalSlice']) {
		const property = node.properties.find(
			(p) => p.name === 'countries' && p.displayOptions.show.resource.includes(resource),
		);
		const value = resolve(property.routing.send.value, { $value: ' us, GB, ' });
		assert.deepEqual(value, resource === 'company' ? ['US', 'GB'] : 'US,GB');
	}
	const query = node.properties.find((p) => p.name === 'signalQuery');
	assert.equal(query.routing.send.property, 'signal_query');
	assert.equal(
		resolve(query.routing.send.value, { $value: ' signal:hiring:30d ' }),
		'signal:hiring:30d',
	);
	const get = node.properties
		.find((p) => p.name === 'operation' && p.displayOptions.show.resource.includes('company'))
		.options.find((o) => o.value === 'get');
	assert.equal(
		resolve(get.routing.request.url, {
			$parameter: { companyId: ' 4066c846-48ea-403a-97b1-fd60503fdb97 ' },
		}),
		'/companies/4066c846-48ea-403a-97b1-fd60503fdb97',
	);
});

test('credentials use a masked key, fixed destination and unmetered health check', () => {
	const credential = new VeilstratApi();
	assert.equal(credential.properties[0].typeOptions.password, true);
	assert.equal(
		resolve(credential.authenticate.properties.headers.Authorization, {
			$credentials: { apiKey: 'test-not-a-real-key' },
		}),
		'Bearer test-not-a-real-key',
	);
	assert.equal(credential.test.request.baseURL, node.requestDefaults.baseURL);
	assert.equal(credential.test.request.url, '/health');
});

test('valid narrow searches pass without mutating request options', async () => {
	const request = {
		method: 'POST',
		url: '/companies',
		body: { signal_query: parameters.signalQuery },
	};
	assert.equal(await validateRequest.call(context(parameters), request), request);
	await validateRequest.call(context({ ...parameters, page: 10, pageSize: 50 }), request);
});

for (const [name, change, pattern] of [
	['blank query', { signalQuery: ' ' }, /signal query/],
	['country name instead of code', { countries: 'United States' }, /two-letter/],
	['zero page size', { pageSize: 0 }, /Page size/],
	['oversized page', { pageSize: 51 }, /Page size/],
	['fractional page size', { pageSize: 1.5 }, /Page size/],
	['zero page', { page: 0 }, /Choose a page/],
	['deep page', { page: 11, pageSize: 50 }, /500 records/],
	['fractional page', { page: 1.5 }, /Choose a page/],
	['invalid company ID', { operation: 'get', companyId: 'https://attacker.example' }, /UUID/],
	['blank slice', { resource: 'signalSlice', slice: ' ', scoreMin: 70 }, /slice identifier/],
	[
		'score above range',
		{ resource: 'signalSlice', slice: 'ai-sdr-hiring', scoreMin: 101 },
		/Minimum score/,
	],
	[
		'nonfinite score',
		{ resource: 'signalSlice', slice: 'ai-sdr-hiring', scoreMin: NaN },
		/Minimum score/,
	],
])
	test(`rejects ${name} before API dispatch`, async () => {
		await assert.rejects(
			validateRequest.call(context({ ...parameters, ...change }), { url: '/companies' }),
			pattern,
		);
	});

test('valid dossier and country-free filtered slice pass', async () => {
	await validateRequest.call(
		context({
			resource: 'company',
			operation: 'get',
			companyId: '4066c846-48ea-403a-97b1-fd60503fdb97',
		}),
		{ url: '/companies/id' },
	);
	await validateRequest.call(
		context({
			resource: 'signalSlice',
			operation: 'search',
			slice: 'ai-sdr-hiring',
			scoreMin: 0,
			countries: '',
		}),
		{ url: '/slices' },
	);
});
