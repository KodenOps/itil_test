import ClientMaterial from './ClientMaterial';

type PageProps = {
	params: {
		id: string;
	};
	searchParams: {
		type?: string;
		title?: string;
		author?: string;
	};
};

export default function Page({ params, searchParams }: PageProps) {
	return (
		<ClientMaterial
			materialId={params.id}
			type={searchParams.type ?? ''}
			title={searchParams.title ?? ''}
			author={searchParams.author ?? ''}
		/>
	);
}
