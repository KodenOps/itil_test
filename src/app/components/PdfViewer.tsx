'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '@/styles/pdf-viewer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
// Point to public folder version — must be a plain string URL
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfViewer({ fileUrl }: { fileUrl: string }) {
	const [numPages, setNumPages] = useState<number>(0);
	const [containerWidth, setContainerWidth] = useState<number>(800);
	const containerRef = useRef<HTMLDivElement>(null);

	// Adjust width on mount and resize
	useEffect(() => {
		function updateWidth() {
			if (containerRef.current) {
				const width = containerRef.current.offsetWidth;
				setContainerWidth(width > 800 ? 800 : width); // max width 800
			}
		}
		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	}, []);

	return (
		<div
			ref={containerRef}
			className='flex flex-col items-center w-full px-2'
			onContextMenu={(e) => e.preventDefault()} // disable right-click
		>
			<Document
				file={fileUrl}
				onLoadSuccess={({ numPages }) => setNumPages(numPages)}
				loading={<div className='text-gray-500'>Loading PDF...</div>}>
				{Array.from({ length: numPages }, (_, idx) => (
					<Page
						key={idx}
						pageNumber={idx + 1}
						width={containerWidth}
					/>
				))}
			</Document>
		</div>
	);
}
