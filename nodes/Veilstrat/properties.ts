import type { INodeProperties } from 'n8n-workflow';
import { validateRequest } from './validation';
const companySearch = { resource: ['company'], operation: ['search'] };
const sliceSearch = { resource: ['signalSlice'], operation: ['search'] };
export const companyProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['company'] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a company dossier',
				description: 'Retrieve a company dossier using its UUID',
				routing: {
					request: {
						method: 'GET',
						url: '=/companies/{{encodeURIComponent($parameter.companyId.trim())}}',
					},
					send: { preSend: [validateRequest] },
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search companies',
				description: 'Retrieve one page of companies and preserve pagination metadata',
				routing: {
					request: { method: 'POST', url: '/companies' },
					send: { preSend: [validateRequest] },
				},
			},
		],
		default: 'search',
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '4066c846-48ea-403a-97b1-fd60503fdb97',
		description: 'Company UUID returned by search or a VeilStrat webhook',
		displayOptions: { show: { resource: ['company'], operation: ['get'] } },
	},
	{
		displayName: 'Signal Query',
		name: 'signalQuery',
		type: 'string',
		required: true,
		default: 'signal:hiring:30d',
		description:
			'Query using the current filter catalog, for example signal:hiring:30d & tool:clay',
		displayOptions: { show: companySearch },
		routing: { send: { type: 'body', property: 'signal_query', value: '={{$value.trim()}}' } },
	},
	{
		displayName: 'Countries',
		name: 'countries',
		type: 'string',
		default: '',
		placeholder: 'US,GB',
		description: 'Optional comma-separated two-letter country codes',
		displayOptions: { show: companySearch },
		routing: {
			send: {
				type: 'body',
				property: 'countries',
				value:
					'={{$value.split(",").map(country => country.trim().toUpperCase()).filter(Boolean)}}',
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1, maxValue: 500, numberPrecision: 0 },
		description: 'Page to request; later pages consume page-turn quota. No automatic pagination.',
		displayOptions: { show: companySearch },
		routing: { send: { type: 'body', property: 'page' } },
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 10,
		typeOptions: { minValue: 1, maxValue: 50, numberPrecision: 0 },
		description: 'Maximum companies per page. Successful requests consume API record quota.',
		displayOptions: { show: companySearch },
		routing: { send: { type: 'body', property: 'pageSize' } },
	},
];
export const sliceProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['signalSlice'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search a signal slice',
				description: 'Retrieve a filtered signal slice and preserve response metadata',
				routing: {
					request: { method: 'GET', url: '/slices' },
					send: { preSend: [validateRequest] },
				},
			},
		],
		default: 'search',
	},
	{
		displayName: 'Slice',
		name: 'slice',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ai-sdr-hiring',
		description: 'Slice identifier from Account > Get Filters',
		displayOptions: { show: sliceSearch },
		routing: { send: { type: 'query', property: 'slice', value: '={{$value.trim()}}' } },
	},
	{
		displayName: 'Countries',
		name: 'countries',
		type: 'string',
		default: '',
		placeholder: 'US,GB',
		description: 'Optional comma-separated two-letter country codes',
		displayOptions: { show: sliceSearch },
		routing: {
			send: {
				type: 'query',
				property: 'countries',
				value:
					'={{$value.split(",").map(country => country.trim().toUpperCase()).filter(Boolean).join(",")}}',
			},
		},
	},
	{
		displayName: 'Minimum Score',
		name: 'scoreMin',
		type: 'number',
		default: 70,
		typeOptions: { minValue: 0, maxValue: 100 },
		required: true,
		description: 'Minimum VeilStrat prioritization score; this is not a probability of purchase',
		displayOptions: { show: sliceSearch },
		routing: { send: { type: 'query', property: 'scoreMin' } },
	},
];
export const accountProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['account'] } },
		options: [
			{
				name: 'Get Filters',
				value: 'getFilters',
				action: 'Get the filter catalog',
				description: 'Discover supported queries, tools, and slices',
				routing: { request: { method: 'GET', url: '/filters' } },
			},
			{
				name: 'Get Health',
				value: 'getHealth',
				action: 'Get API health',
				description: 'Check connectivity without consuming the request budget',
				routing: { request: { method: 'GET', url: '/health' } },
			},
			{
				name: 'Get Usage',
				value: 'getUsage',
				action: 'Get account usage',
				description: 'Check remaining API budgets without consuming the request budget',
				routing: { request: { method: 'GET', url: '/stats' } },
			},
		],
		default: 'getUsage',
	},
];
