interface Data {
	title?: string;
	theme?: string;
	name: string;
	description: string;
	animation?: {
		nameRandomizer: boolean;
	};
	links: {
		name: string;
		url: string;
		icon?: any;
	}[];
}
