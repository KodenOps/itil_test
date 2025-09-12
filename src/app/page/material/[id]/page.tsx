import ClientMaterial from './ClientMaterial/page';

const materials = [
	{
		id: 'exam-guidelines',
		title: 'Exam Guidelines',
		type: 'pdf',
		author: 'PeopleCerts Officials',
	},
	{
		id: 'itil-textbook',
		title: 'ITIL Foundation Textbook',
		type: 'pdf',
		author: 'Axelos Limited',
	},
	{
		id: 'itil-exam-study',
		title: 'ITIL Foundation Exam Study',
		type: 'pdf',
		author: 'Liz Gallacher and Helen Morris',
	},
	{
		id: 'itil-slides',
		title: 'ITIL Foundation Slide',
		type: 'pdf',
		author: 'Sanmi Samuel Ogunjobi',
	},
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
			author={material.author || 'Unknown Author'}
		/>
	);
}
