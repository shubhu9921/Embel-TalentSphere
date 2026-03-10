import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, PhoneCall, ChevronRight } from 'lucide-react';
import Card from '../../components/Card';

const Help = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Help & Support</h1>
                <p className="text-slate-500 font-medium mt-1">Get the most out of Embel TalentSphere hiring platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 border-none ring-1 ring-slate-100 shadow-xl shadow-orange-100/50 hover:ring-[#ff6e00] hover:bg-orange-50 transition-all cursor-pointer group">
                    <BookOpen className="w-10 h-10 text-[#ff6e00] mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Platform Documentation</h3>
                    <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Detailed guides on managing vacancies, assessment creation, and interviewing techniques.</p>
                    <div className="flex items-center gap-2 text-xs font-black text-[#ff6e00] uppercase tracking-widest">
                        Browse Guides <ChevronRight className="w-4 h-4" />
                    </div>
                </Card>

                <Card className="p-8 border-none ring-1 ring-slate-100 shadow-xl shadow-orange-100/50 hover:ring-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer group">
                    <MessageSquare className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Live Chat Support</h3>
                    <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Get immediate assistance from our technical support team for real-time issues.</p>
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest">
                        Start Conversation <ChevronRight className="w-4 h-4" />
                    </div>
                </Card>
            </div>

            <Card className="p-10 border-none ring-1 ring-slate-100 shadow-sm bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-900 mb-8">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    {[
                        { q: "How do I schedule an interview?", a: "Go to the candidate's profile and click the 'Schedule Interview' button." },
                        { q: "Can I edit questions after a vacancy is live?", a: "Yes, you can manage the question bank at any time via the Question Bank menu." },
                        { q: "How are candidate scores calculated?", a: "Scores are automatically generated based on the correct answers defined in the Question Bank." }
                    ].map((item, i) => (
                        <div key={i} className="space-y-2">
                            <p className="text-sm font-black text-slate-900">Q: {item.q}</p>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex items-center justify-center pt-10">
                <div className="flex items-center gap-4 text-slate-400">
                    <PhoneCall className="w-5 h-5" />
                    <span className="text-sm font-bold">24/7 Priority Support for Recruiters: +91 999 999 9999</span>
                </div>
            </div>
        </div>
    );
};

export default Help;
