import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Button from '../../components/Button';
import { Play, Send, ChevronDown } from 'lucide-react';

const CodingEditor = ({ initialCode = '', language = 'javascript', onSave }) => {
    const [code, setCode] = useState(initialCode);
    const [lang, setLang] = useState(language);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
    ];

    const handleRun = () => {
        setIsRunning(true);
        setOutput('Running code...');
        // Mock execution
        setTimeout(() => {
            setOutput(`Success! Output:\nHello World from ${lang.toUpperCase()}`);
            setIsRunning(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-[#333]">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="appearance-none bg-[#3c3c3c] text-slate-200 text-sm px-4 py-1.5 pr-8 rounded-lg outline-none hover:bg-[#454545] transition-colors cursor-pointer"
                        >
                            {languages.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="text-slate-300 hover:text-white hover:bg-white/10 py-1.5"
                        onClick={handleRun}
                        disabled={isRunning}
                    >
                        <Play className={`w-4 h-4 mr-2 ${isRunning ? 'animate-pulse' : ''}`} />
                        Run
                    </Button>
                    <Button
                        variant="primary"
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => onSave && onSave(code)}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Submit Code
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-[400px]">
                <Editor
                    height="100%"
                    language={lang}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        padding: { top: 20 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>

            <div className="h-32 bg-[#252526] border-t border-[#333] p-4 font-mono text-sm overflow-y-auto">
                <div className="text-slate-500 mb-2 uppercase text-[10px] tracking-widest font-bold">Console Output</div>
                <pre className={`${output.includes('Success') ? 'text-emerald-400' : 'text-slate-300 whitespace-pre-wrap'}`}>
                    {output || 'No output yet. Click "Run" to see results.'}
                </pre>
            </div>
        </div>
    );
};

export default CodingEditor;
