import { useState, useRef, useEffect } from 'react';
import { Plus, Send } from 'lucide-react';
import { cn } from '@nexus/shared';

interface QuickTaskInputProps {
    onSubmit: (title: string) => void;
    placeholder?: string;
}

export function QuickTaskInput({ onSubmit, placeholder = "Nova tarefa..." }: QuickTaskInputProps) {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value.trim());
            setValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && value.trim()) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={cn(
            "flex items-center gap-2 p-3 rounded-xl border transition-all",
            isFocused ? "border-primary bg-primary/5" : "border-muted bg-muted/30"
        )}>
            <Plus className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                isFocused ? "text-primary" : "text-muted-foreground"
            )} />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            />
            {value.trim() && (
                <button
                    onClick={handleSubmit}
                    className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <Send className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
