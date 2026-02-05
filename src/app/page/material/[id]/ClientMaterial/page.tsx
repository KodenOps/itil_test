import ClientMaterial from './ClientMaterial';

type PageProps = {
	params: Promise<{
		id: string;
	}>;
	searchParams: Promise<{
		type?: string;
		title?: string;
		author?: string;
	}>;
};

export default async function Page({ params, searchParams }: PageProps) {
	const { id } = await params;
	const { type, title, author } = await searchParams;

	return (
		<ClientMaterial
			materialId={id}
			type={type ?? ''}
			title={title ?? ''}
			author={author ?? ''}
		/>
	);
}
