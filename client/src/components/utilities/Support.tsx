export default function Support() {
    return (
        <>
            <h1 className="mb-6">Student resources</h1>
            <section className="flex flex-wrap gap-6 px-4">
                <div className="basis-64">
                    <h2 className="font-semibold mb-0.5">Crisis Text Line</h2>
                    <h3><a href="sms:741-741">741-741</a></h3>
                    <p className="secondary">
                        For everyone in crisis; text "Help", Text "LGBTQ" for LGBTQQ-specific support.
                    </p>
                </div>
                <div className="basis-64">
                    <h2 className="font-semibold mb-0.5">Suicide Prevention Hotline</h2>
                    <h3><a href="tel:800-273-8256">800-273-8256</a></h3>
                    <p className="secondary">Prevention and crisis resources (national)</p>
                </div>
                <div className="basis-64">
                    <h2 className="font-semibold mb-0.5">Suicide & Crisis Line</h2>
                    <h3><a href="tel:855-278-4204">855-278-4204</a></h3>
                    <p className="secondary">For individuals in crisis (Santa Clara County)</p>
                </div>
                <div className="basis-64">
                    <h2 className="font-semibold mb-0.5">Star Vista</h2>
                    <h3><a href="tel:650-579-0350">650-579-0350</a></h3>
                    <p className="secondary">Crisis intervention (San Mateo County)</p>
                </div>
                <div className="basis-64">
                    <h2 className="font-semibold mb-0.5">Uplift</h2>
                    <h3><a href="tel:408-379-9085">408-379-9085</a></h3>
                    <p className="secondary">Mobile crisis intervention and safety planning</p>
                </div>
                <div className="basis-64">
                    <h2 className="font-semibold mb-0.5">Trevor Lifeline</h2>
                    <h3><a href="tel:866-488-7386">866-488-7386</a></h3>
                    <p className="secondary">LGBTQ crisis intervention and suicide prevention</p>
                </div>
            </section>
        </>
    );
}
