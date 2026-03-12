import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Button from '../../components/Button';
import { Play, Send } from 'lucide-react';
import Select from '../../components/Select';

const CodingEditor = ({ initialCode = '', language = 'javascript', onSave }) => {
    const [code, setCode] = useState(initialCode);
    const [lang, setLang] = useState(language);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const languages = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'python', label: 'Python' },
        { id: 'cpp', label: 'C++' },
        { id: 'java', label: 'Java' },
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
                    <div className="relative overflow-visible">
                        <Select
                            value={lang}
                            options={languages}
                            onSelect={l => setLang(l)}
                            placeholder="Select Language"
                            triggerClassName="h-9 bg-[#3c3c3c] border-[#444] text-slate-200 rounded-lg hover:bg-[#454545] py-2 px-3"
                            contentClassName="bg-[#3c3c3c] border-[#555] text-slate-200 w-48 mt-1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Play}
                        className="text-slate-300 hover:text-white hover:bg-white/10"
                        onClick={handleRun}
                        disabled={isRunning}
                        loading={isRunning}
                    >
                        Run
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        icon={Send}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => onSave && onSave(code)}
                    >
                        Submit Code
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-100">
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
