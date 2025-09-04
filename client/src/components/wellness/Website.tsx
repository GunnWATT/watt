import { ReactNode } from 'react';

export default function Website() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Mental Health Resources</h2>
            <div className="space-y-3">
                <section className="grid grid-cols-[repeat(auto-fill,_minmax(16rem,_1fr))] gap-2">
                    <SupportCard name="Gunn wellness team" link="gunnwellnessteam@pausd.org" email>
                        Email the wellness team for support, questions, or to set up an appointment.
                    </SupportCard>
                    <SupportCard name="Care Solace" link="https://www.caresolace.com/site/pausdfamilies">
                        24/7/365 Mental Health and Social Service Care Coordination Service for Palo Alto Unified School District Students, Staff, and their Families
                    </SupportCard>
                </section>
            </div>
        </div>
    );
}

type SupportCardProps = { name: string, link: string, children: ReactNode, email?: boolean }
function SupportCard(props: SupportCardProps) {
    const { name, link, children, email } = props;

    return (
        <div className="px-5 py-3 bg-gray-100 dark:bg-content-secondary rounded">
            <h2 className="font-semibold mb-0.5">{name}</h2>
            <h3>
                <a
                    href={email ? `mailto:${link}` : link}
                    target={email ? undefined : "_blank"}
                    rel={email ? undefined : "noopener noreferrer"}
                    className='break-all'
                >
                    {link}
                </a>
            </h3>
            <p className="text-secondary">{children}</p>
        </div>
    )
}
