import {
	NodeOperationError,
	type IExecuteSingleFunctions,
	type IHttpRequestOptions,
} from 'n8n-workflow';

// Validate literal values and expressions before sending metered API requests.
export async function validateRequest(
	this: IExecuteSingleFunctions,
	request: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const resource = this.getNodeParameter('resource') as string;
	const operation = this.getNodeParameter('operation') as string;
	const fail = (message: string): never => {
		throw new NodeOperationError(this.getNode(), message);
	};
	const countries = String(this.getNodeParameter('countries', '')).trim();
	if (countries && countries.split(',').some((country) => !/^[A-Za-z]{2}$/.test(country.trim())))
		fail('Countries must be comma-separated two-letter codes, for example US,GB.');
	if (resource === 'company' && operation === 'search') {
		if (!String(this.getNodeParameter('signalQuery')).trim())
			fail('Enter a signal query from the current filter catalog.');
		const pageSize = Number(this.getNodeParameter('pageSize'));
		const page = Number(this.getNodeParameter('page'));
		if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 50)
			fail('Page size must be an integer between 1 and 50.');
		if (!Number.isInteger(page) || page < 1 || (page - 1) * pageSize >= 500)
			fail('Choose a page with an offset below the API limit of 500 records.');
	}
	if (resource === 'company' && operation === 'get') {
		if (
			!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				String(this.getNodeParameter('companyId')).trim(),
			)
		)
			fail('Enter a company UUID returned by search or a VeilStrat webhook.');
	}
	if (resource === 'signalSlice') {
		if (!String(this.getNodeParameter('slice')).trim())
			fail('Enter a slice identifier from the filter catalog.');
		const score = Number(this.getNodeParameter('scoreMin'));
		if (!Number.isFinite(score) || score < 0 || score > 100)
			fail('Minimum score must be between 0 and 100.');
	}
	return request;
}
