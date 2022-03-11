export default function Wave() {
    const leftColor = 'ff594c';
    const rightColor = 'eb144c';

    return (
        <svg className="fixed top-0 left-0 -z-10 w-[max(800px,_100%)]" viewBox="0 0 1440 700" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="low">
                    <stop offset="5%" stopColor={`#${rightColor}44`}/>
                    <stop offset="95%" stopColor={`#${leftColor}44`}/>
                </linearGradient>
            </defs>
            <path
                d="M 0,700 C 0,700 0,175 0,175 C 78.47846889952157,188.7224880382775 156.95693779904315,202.44497607655504 251,214 C 345.04306220095685,225.55502392344496 454.6507177033492,234.9425837320574 556,217 C 657.3492822966508,199.0574162679426 750.4401913875598,153.7846889952153 839,157 C 927.5598086124402,160.2153110047847 1011.5885167464114,211.91866028708134 1111,223 C 1210.4114832535886,234.08133971291866 1325.2057416267944,204.54066985645932 1440,175 C 1440,175 1440,700 1440,700 Z"
                stroke="none" strokeWidth="0" fill="url(#low)"
                className="transition-all duration-300 ease-in-out delay-150"
                transform="rotate(-180 720 350)"
            />
            <defs>
                <linearGradient id="middle">
                    <stop offset="5%" stopColor={`#${rightColor}66`}/>
                    <stop offset="95%" stopColor={`#${leftColor}66`}/>
                </linearGradient>
            </defs>
            <path
                d="M 0,700 C 0,700 0,350 0,350 C 85.04306220095694,332.4593301435407 170.08612440191388,314.91866028708137 252,333 C 333.9138755980861,351.08133971291863 412.6985645933014,404.7846889952153 525,412 C 637.3014354066986,419.2153110047847 783.1196172248806,379.94258373205747 881,355 C 978.8803827751194,330.05741626794253 1028.822966507177,319.444976076555 1114,321 C 1199.177033492823,322.555023923445 1319.5885167464116,336.2775119617225 1440,350 C 1440,350 1440,700 1440,700 Z"
                stroke="none" strokeWidth="0" fill="url(#middle)"
                className="transition-all duration-300 ease-in-out delay-150"
                transform="rotate(-180 720 350)"
            />
            <defs>
                <linearGradient id="high">
                    <stop offset="5%" stopColor={`#${rightColor}88`}/>
                    <stop offset="95%" stopColor={`#${leftColor}88`}/>
                </linearGradient>
            </defs>
            <path
                d="M 0,700 C 0,700 0,525 0,525 C 117.15789473684211,555.5837320574162 234.31578947368422,586.1674641148326 325,588 C 415.6842105263158,589.8325358851674 479.8947368421052,562.9138755980861 572,534 C 664.1052631578948,505.08612440191393 784.1052631578948,474.177033492823 890,468 C 995.8947368421052,461.822966507177 1087.6842105263158,480.37799043062205 1177,494 C 1266.3157894736842,507.62200956937795 1353.157894736842,516.311004784689 1440,525 C 1440,525 1440,700 1440,700 Z"
                stroke="none" strokeWidth="0" fill="url(#high)"
                className="transition-all duration-300 ease-in-out delay-150"
                transform="rotate(-180 720 350)"
            />
        </svg>
    )
}
