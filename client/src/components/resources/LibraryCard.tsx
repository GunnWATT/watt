export default function LibraryCard() {
    return (
        <>
            <h1 className="text-4xl font-bold mb-5 pr-6">
                Palo Alto Library Card
            </h1>

            <div className="hidden sm:flex sm:flex-col rounded-lg w-96 mx-auto bg-content-secondary dark:bg-background overflow-hidden mb-4 shadow-lg" aria-hidden>
                <div className="h-5 border-b border-tertiary dark:border-tertiary-dark" />
                <div className="relative h-32">
                    <div className="w-48 h-12 absolute top-2 left-0 bg-background dark:bg-content-secondary rounded-r-lg" />
                    <div className="w-[5.5rem] absolute inset-y-2 right-4 bg-background dark:bg-content-secondary" />
                    <p className="absolute inset-x-0 bottom-2 text-center secondary font-bold italic pr-6">
                        2021-2022
                    </p>
                </div>
                <div className="pb-2 pt-0.5 bg-background dark:bg-content-secondary border-t border-tertiary dark:border-tertiary-dark">
                    <p className="text-center font-medium secondary mb-1">Your Name</p>
                    <p className="text-center text-xs secondary">
                        Grade: XX | St. #: 950XXXXX | L #: XXXXXXXXXXXXXX
                    </p>
                </div>
            </div>

            <p>
                Every PAUSD student has access to a Palo Alto library account via their student ID card. The account
                number can be found on the bottom right of the card (labelled <strong>L#</strong>). The default PIN is{' '}
                <strong>1234</strong>.
            </p>
        </>
    )
}
