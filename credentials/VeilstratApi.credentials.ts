import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';
export class VeilstratApi implements ICredentialType {
	name = 'veilstratApi';
	icon: ICredentialType['icon'] = {
		light: 'file:../nodes/Veilstrat/veilstrat.svg',
		dark: 'file:../nodes/Veilstrat/veilstrat.dark.svg',
	};
	displayName = 'VeilStrat API';
	documentationUrl = 'https://app.veilstrat.com/docs/api';
	httpRequestNode = {
		name: 'VeilStrat',
		docsUrl: 'https://app.veilstrat.com/docs/api',
		apiBaseUrl: 'https://app.veilstrat.com/api/v1',
	};
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'Create a team key in VeilStrat Settings > API. Requires Pro with the API Access add-on.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: { headers: { Authorization: '=Bearer {{$credentials.apiKey}}' } },
	};
	test: ICredentialTestRequest = {
		request: { baseURL: 'https://app.veilstrat.com/api/v1', url: '/health', method: 'GET' },
	};
}
