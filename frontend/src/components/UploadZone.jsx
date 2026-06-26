import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'

const ACCEPTED = '.pdf,.docx,.doc,.txt'

export default function UploadZone({onFiles , busy}){
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const handleFiles = ((fileList)=>{
        const files = Array.from(fileList || [])
        if(files.length) onFiles(files)
    })

    return (
        <div
        onDragOver={(e)=>{
            e.preventDefault();
            setDragging(true);
        }}
        onDragLeave={()=> setDragging(false)}
        onDrop={(e)=>{
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files)
        }}
        onClick={()=>inputRef.current?.click()}
        role='button'
        tabIndex={0}
        className={`paper-card border-dashed cursor-pointer text-center px-6 py-10 transition-colors ${
                    dragging
                        ? 'border-chalk-blue-dark bg-chalk-blue/10'
                        : 'hover:border-pencil/40'
                    }`}
        style={{ borderWidth: 2 }}
        >
            <input 
            ref={inputRef}
            type='file'
            accept={ACCEPTED}
            multiple
            className='hidden'
            onChange={(e)=>{
                handleFiles(e.target.files);
                e.target.value=''
            }}
             />
            <div className="w-12 h-12 rounded-full bg-highlighter/25 flex items-center justify-center mx-auto mb-3.5">
                <UploadCloud className="w-6 h-6 text-highlighter-dark" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-semibold text-ink mb-1">
                {busy ? 'Uploading…' : 'Drop your notes here, or click to browse'}
            </p>
            <p className="text-xs text-pencil-soft">PDF, DOCX, or TXT — up to 25MB each</p>
        </div>
    )
}