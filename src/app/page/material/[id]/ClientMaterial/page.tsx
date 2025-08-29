'use client';

import dynamic from 'next/dynamic';
import PptxViewer from '@/app/components/PptxViewer';

const PdfViewer = dynamic(() => import('@/app/components/PdfViewer'), {
	ssr: false,
});

export default function ClientMaterial({
	materialId,
	type,
	title,
}: {
	materialId: string;
	type: string;
	title: string;
}) {
	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>{title}</h1>
			{type === 'pdf' && (
				<PdfViewer fileUrl={`/api/material?id=${materialId}`} />
			)}
			{type === 'pptx' && (
				<PptxViewer fileUrl={`/api/material?id=${materialId}`} />
			)}
		</div>
	);
}
