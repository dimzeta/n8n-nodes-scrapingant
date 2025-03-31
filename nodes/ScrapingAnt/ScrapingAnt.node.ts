import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class ScrapingAnt implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'ScrapingAnt',
		name: 'scrapingAnt',
		icon: 'file:scrapingant.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Scrape any website with ScrapingAnt API',
		defaults: {
			name: 'ScrapingAnt',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'scrapingAntApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.scrapingant.com/v2',
		},

		properties: [
			// Required fields

			// Extraction Type
			{
				displayName: 'Extraction Type',
				name: 'extractionType',
				type: 'options',
				options: [
					{
						name: 'Original',
						value: 'general',
					},
					{
						name: 'JSON (Extended Data)',
						value: 'extended',
					},
					{
						name: 'Markdown',
						value: 'markdown',
					},
					{
						name: 'AI Extracted',
						value: 'extract',
					},
				],
				default: 'extended',
				routing: {
					request: {
						method: 'GET',
						url: '=/{{$value}}',
					},
					output: {
						postReceive: [
							{
								type: 'setKeyValue',
								properties: {
									data: '={{$response.body}}',
								},
							},
						],
					},
				},
			},

			// URL
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				noDataExpression: true,
				default: '',
				placeholder: 'Enter URL',
				required: true,
				description: 'The URL to scrape',
				routing: {
					request: {
						// method: 'GET',
						// url: '=?url={{$value}}'
						qs: {
							url: '={{$value}}',
						},
					},
				},
			},

			// Optional fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					// Cookies
					{
						displayName: 'Cookies',
						name: 'cookies',
						description: 'Format: cookie_name_1=cookie_value_1;cookie_name_2=cookie_value_2',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									cookies: '={{$value}}',
								},
							},
						},
					},

					// JS Snippet
					{
						displayName: 'JS Snippet',
						name: 'jsSnippet',
						description:
							'JS snippet to run inside scraping page after the page load. (applicable to the browser rendering only).',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									js_snippet: '={{$value}}',
								},
							},
						},
					},

					// Proxy Country
					{
						displayName: 'Proxy Country',
						name: 'proxyCountry',
						type: 'options',
						options: [
							{
								name: 'Brazil',
								value: 'BR',
							},
							{
								name: 'Canada',
								value: 'CA',
							},
							{
								name: 'China',
								value: 'CN',
							},
							{
								name: 'United Arab Emirates',
								value: 'AE',
							},
							{
								name: 'USA',
								value: 'US',
							},
						],
						default: 'US',
						placeholder: 'en',
						routing: {
							request: {
								qs: {
									lang: '={{$value}}',
								},
							},
						},
					},

					// Proxy Type
					{
						displayName: 'Proxy Type',
						name: 'proxyType',
						type: 'options',
						description: 'The type of proxy to use',
						options: [
							{
								name: 'Standard',
								value: 'standard',
								description: 'Standard proxy',
							},
							{
								name: 'Residential',
								value: 'residential',
								description: 'Residential proxy',
							},
						],
						default: 'standard',
						routing: {
							request: {
								qs: {
									proxy_type: '={{$value}}',
								},
							},
						},
					},

					// Return page source (only available for headless browser)
					{
						displayName: 'Return Page Source',
						name: 'returnPageSource',
						description: 'Whether to return the page source. Only available for headless browser.',
						type: 'boolean',
						default: false,
						routing: {
							request: {
								qs: {
									return_page_source: '={{$value}}',
								},
							},
						},
					},

					// Use headless browser
					{
						displayName: 'Use Headless Browser',
						name: 'useHeadlessBrowser',
						type: 'boolean',
						default: true,
						description: 'Whether to use the headless browser to scrape the website',
						routing: {
							request: {
								qs: {
									browser: '={{$value}}',
								},
							},
						},
					},

					// Wait for CSS Selector
					{
						displayName: 'Wait for CSS Selector',
						name: 'waitForSelector',
						type: 'string',
						default: '',
						description:
							'CSS selector of the DOM element to wait before returning the result. (applicable to the browser rendering only).',
						routing: {
							request: {
								qs: {
									wait_for_selector: '={{$value}}',
								},
							},
						},
					},
				],
			},
		],
	};
}
