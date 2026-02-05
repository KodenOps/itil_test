import ClientMaterial, { ClientMaterialProps } from './ClientMaterial';

export default function Page({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams?: { type?: string; title?: string; author?: string };
}) {
	const { id } = params;
	const { type, title, author } = searchParams || {};

	const material: ClientMaterialProps = {
		materialId: id,
		type: type ?? 'pdf',
		title: title ?? 'Untitled Material',
		author: author ?? 'Unknown Author',
	};

	return <ClientMaterial {...material} />;
}
