import ClientMaterial from './ClientMaterial/page';

const materials = [
	{ id: '1', title: 'Exam Guidelines', type: 'pdf' },
	{ id: '2', title: 'ITIL Foundation Textbook', type: 'pdf' },
	{ id: '3', title: 'ITIL Foundation Exam Study', type: 'pdf' },
	{ id: '4', title: 'ITIL Foundation Slide', type: 'pdf' },
];

export default async function MaterialPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const material = materials.find((m) => m.id === id);
	if (!material)
		return <div className='p-10 text-red-600'>Material not found</div>;

	return (
		<ClientMaterial
			materialId={material.id}
			type={material.type}
			title={material.title}
		/>
	);
}
