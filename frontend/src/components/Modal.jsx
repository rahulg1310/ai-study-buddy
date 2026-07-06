import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({
    open,
    onClose,
    title,
    children
}) => {
    useEffect(()=>{
        if(!open){
            return;
        }
        function handleKeyDown(e){
            if(e.key === "Escape"){
                onClose();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return ()=>{
            window.removeEventListener("keydown", handleKeyDown);
        }
    },[open]);
    if(!open){
        return null;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-lg paper-card p-6 shadow-xl">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="font-display text-2xl text-ink">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-paper-line"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal