import ClientMaterial, { ClientMaterialProps } from './ClientMaterial';

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

export default async function Page({ params, searchParams }: PageProps) {
	const { id } = params;
	const { type, title, author } = searchParams;

	// Construct props for client component
	const material: ClientMaterialProps = {
		materialId: id,
		type: type ?? 'pdf', // default type
		title: title ?? 'Untitled Material',
		author: author ?? 'Unknown Author',
	};

	return <ClientMaterial {...material} />;
}
