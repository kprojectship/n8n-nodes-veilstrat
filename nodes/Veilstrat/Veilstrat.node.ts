import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { companyProperties, sliceProperties, accountProperties } from './properties';

export class Veilstrat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VeilStrat',
		name: 'veilstrat',
		icon: { light: 'file:veilstrat.svg', dark: 'file:veilstrat.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Research company funding, AI hiring, and technology adoption with VeilStrat',
		defaults: { name: 'VeilStrat' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'veilstratApi', required: true }],
		requestDefaults: {
			baseURL: 'https://app.veilstrat.com/api/v1',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Company', value: 'company' },
					{ name: 'Signal Slice', value: 'signalSlice' },
				],
				default: 'company',
			},
			...companyProperties,
			...sliceProperties,
			...accountProperties,
		],
	};
}
