import React from 'react';

interface Material {
	id: string;
	title: string;
	type: 'pdf' | 'pptx';
	linkToFile?: string;
}

const Page = () => {
	const materials: Material[] = [
		{
			id: '1',
			title: 'Exam Guidelines',
			type: 'pdf',
			linkToFile: '/secured_files/exam_guidelines.pdf',
		},
		{ id: '2', title: 'ITIL Foundation Textbook', type: 'pdf', linkToFile: '' },
		{
			id: '3',
			title: 'ITIL Foundation Exam Study',
			type: 'pdf',
			linkToFile: '',
		},
		{ id: '4', title: 'ITIL Foundation Slide', type: 'pdf', linkToFile: '' },
	];

	return (
		<div className='w-full'>
			<section className='w-full h-full flex md:items-start mt-[50px] overflow-hidden justify-center'>
				<div className='w-full h-full flex md:items-start mt-[50px] overflow-hidden justify-center'>
					<div className='title items-center flex flex-col'>
						<h3 className='text-green-900 font-bold md:text-4xl text-2xl text-center'>
							Study Materials
						</h3>
						<p className='md:text-xl text-center mt-4 md:px-10 px-6 md:w-[70vw] w-full text-[#696969] font-medium'>
							Here you can find various study materials files to help you
							prepare for your ITIL exam.
						</p>

						<div className='flex flex-wrap items-center justify-center w-full mt-6 gap-4'>
							{materials.map((material) => (
								<a
									key={material.id}
									href={`/page/material/${material.id}`}
									className='cursor-pointer md:h-[200px] md:w-[200px] w-[150px] h-[150px] shadow-lg border-2 border-[#c4c4c4] rounded-sm flex md:p-2 p-2 flex-col text-center justify-center items-center font-bold text-[#696969]'>
									{material.title} <br /> ({material.type.toUpperCase()})
								</a>
							))}
						</div>
					</div>
				</div>
			</section>
			<div className='w-full flex justify-center'>
				<a
					href='/'
					className='text-lg text-center w-full  text-blue-600 underline mt-6 p-4 cursor-pointer'>
					Go back Home
				</a>
			</div>
		</div>
	);
};

export default Page;
