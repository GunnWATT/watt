# WATT Style Guide

The tentative WATT Style Guide™. These are not hard requirements and your firstborn child will not be sacrificed if you
do not follow them strictly, but this is what I think looks good and what I will typically refactor code to look like.

In general, WATT follows language and framework conventions, with a few extra guidelines sprinkled in for taste.
This guide will reiterate those conventions for ease of reference; relevant sections in outside style guides will be linked.

## General
### 1.1 — Prefer semicolonfull to semicolonless code
```ts
// Prefer
const num = 100;
// to
const num = 100
```

### 1.2 — Leave 2 newlines between imports and code
```ts
// Prefer
import fetch from 'node-fetch';
import {readFileSync, writeFileSync} from 'fs';


const prev = JSON.parse(readFileSync('./input/clubs.json').toString());
// ...
writeFileSync('./output/clubs.json', JSON.stringify(prev, null, 4));
// ...
```

### 1.3 — Group imports if importing many things at once
```ts
// Prefer
import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';

// Components
import Dashboard from '../components/classes/Dashboard';
import Upcoming from '../components/classes/Upcoming';
import Materials from '../components/classes/Materials';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import Loading from '../components/layout/Loading';
import RedBackground from '../components/layout/RedBackground';

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../contexts/UserDataContext';

// Utilities
import { parsePeriodColor } from '../components/schedule/Periods';
import { useScreenType } from '../hooks/useScreenType';
// ...

// to
import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';
import Dashboard from '../components/classes/Dashboard';
import Upcoming from '../components/classes/Upcoming';
import Materials from '../components/classes/Materials';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import Loading from '../components/layout/Loading';
import RedBackground from '../components/layout/RedBackground';
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../contexts/UserDataContext';
import { parsePeriodColor } from '../components/schedule/Periods';
import { useScreenType } from '../hooks/useScreenType';
```
Even if not spacing with newlines and comments, prefer ordered and grouped imports over arbitrary patterns:
```ts
// The worst import pattern
import Materials from '../components/classes/Materials';
import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';
import RedBackground from '../components/layout/RedBackground';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../contexts/UserDataContext';
import Dashboard from '../components/classes/Dashboard';
import { parsePeriodColor } from '../components/schedule/Periods';
import Upcoming from '../components/classes/Upcoming';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import { useScreenType } from '../hooks/useScreenType';
import Loading from '../components/layout/Loading';
// ...
```

### 1.4 — Prefer importing functions directly instead of using default imports where possible
```ts
// Prefer
import {readFileSync, writeFileSync} from 'fs';
// to
import fs from 'fs';
```

## React
### 2.1 — Prefer functional components to arrow functions
```tsx
// Prefer
export default function Sidebar(props: ...) {
    // ...
}
// to
const Sidebar = (props: ...) => {
    // ...
}

export default Sidebar;
```
This disallows use of `React.FC<T>` but use of that is [inadvised](https://gist.github.com/ky28059/c74ad68be64510af55bba9c6828b2942#props-with-manual-typing) anyhow.

### [2.2 — Prefer `'` to `"`, except in JSX props](https://github.com/airbnb/javascript/tree/master/react#quotes)
```tsx
// Prefer
import { ... } from 'react';
// to
import { ... } from "react";
```
```tsx
// Prefer
const str = 'some string';
// to
const str = "some string";
```
```tsx
// Prefer
<div className="wrapper">...</div>
// to
<div className='wrapper'>...</div>
```
As a side note, avoid using `prop={}` for simple string values:
```tsx
// Prefer
<div className="wrapper">...</div>
// to
<div className={"wrapper"}>...</div>
// or
<div className={'wrapper'}>...</div>
// or
<div className={`wrapper`}>...</div>
```

### [2.3 — Use parentheses for multiline JSX](https://github.com/airbnb/javascript/tree/master/react#parentheses)
```tsx
// Prefer
return (
    <div>
        <h1>...</h1>
        <p>...</p>
    </div>
);
// to
return <div>
    <h1>...</h1>
    <p>...</p>
</div>
```

### [2.4 — Wrap long prop declarations properly](https://github.com/airbnb/javascript/tree/master/react#alignment)
```tsx
// Prefer
<GenericCalendar
    dayClass={(day) => {
        // ...
    }}
    onClickDay={(day) => {
        // ...
    }}
    start={...}
/>
// to
<GenericCalendar dayClass={(day) => ...} onClickDay={(day) => ...} start={...} />
// or
<GenericCalendar dayClass={(day) => {
        // ...
    }} onClickDay={(day) => {
        // ...
    }} start={...} />
```
```tsx
// Prefer
<div
    onClick={(e) => ...}
    style={{...}}
>
    <h1>...</h1>
    <p>...</p>
</div>
// to
<div
    onClick={(e) => ...}
    style={{...}}>
    <h1>...</h1>
    <p>...</p>
</div>
```

### 2.5 — Use default exports for components
```tsx
// Prefer
export default function Container() {
    // ...
}
// to
export function Container() {
    // ...
}
```
```tsx
// Prefer
import Container from './components/Container';
// to
import {Container} from './components/Container';
```
This is a React convention and helps reinforce the idea that you should only have one exported component per file:
```tsx
// Prefer
// Header.tsx
export default function Header() {
    // ...
}

// Footer.tsx
export default function Footer() {
    // ...
}

// to
// Layouts.tsx
export function Header() {
    // ...
}
export function Footer() {
    // ...
}
```

### 2.6 — Use the [boolean prop shortcut](https://gist.github.com/ky28059/c74ad68be64510af55bba9c6828b2942#boolean-props-shortcut)
```tsx
// Prefer
<Sidebar closed />
// to
<Sidebar closed={true} />
```

### 2.7 — Prefer explicitly declaring prop types via `type` as opposed to inlining
```tsx
// Prefer
type ContainerProps = {...};
export default function Container(props: ContainerProps) {
    // ...
}
// to
export default function Container(props: {...}) {
    // ...
}
```
This is so that if the prop type is needed elsewhere, it can quickly be `export`ed. Also, huge inline declarations create
very long lines:
```tsx
export default function ClubComponent(props: {name: string, id: string, teacher: string, room: string, prez: string, coadvisor?: string, desc: string, ...}) {
    // ...
}
```
Prefer not to destructure props directly in the function arguments for a similar reason:
```tsx
// Prefer
export default function ClubComponent(props: ClubComponentProps) {
    const {name, id, teacher, room, prez, coadvisor, desc} = props;
    // ...
}
// to
export default function ClubComponent({name, id, teacher, room, prez, coadvisor, desc}: ClubComponentProps) {
    // ...
}
```

### 2.8 — Prefer `{x && y}` to `{x ? y : null}`
```tsx
// Prefer
{!signedIn && <div>You are not signed in!</div>}
// to
{!signedIn ? <div>You are not signed in!</div> : null}
```
React automatically [discards and doesn't render `false`](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical—operator), 
allowing the `&&` syntactic sugar without having to coerce it to `null`.

### 2.9 — Do not pass context as props
```tsx
// Prefer
function Home() {
    const time = useContext(CurrentTimeContext);
    return (
        <div>
            <Clock />
            ...
        </div>
    );
}

function Clock() {
    const time = useContext(CurrentTimeContext);
    // ...
}

// to
function Home() {
    const time = useContext(CurrentTimeContext);
    return (
        <div>
            <Clock time={time} />
            ...
        </div>
    );
}

type ClockProps = {time: Moment};
function Clock(props: ClockProps) {
    const {time} = props;
    // ...
}
```
The point of context is to eliminate having to pass "global" values as props down the tree and having the child subscribe
to the context is functionally the same (while being more readable) than passing the value downwards.

### [2.10 — Use `/>` to close an empty element](https://github.com/airbnb/javascript/tree/master/react#tags)
```tsx
// Prefer
<div />
// to
<div></div>
```

### 2.11 — Do not use React's default import
```tsx
// Prefer
import {ReactNode} from 'react';

type ContainerProps = {children: ReactNode};

// to
import React from 'react';

type ContainerProps = {children: React.ReactNode};

// or
import React, {ReactNode} from 'react';

type ContainerProps = {children: ReactNode};
```
This is to accommodate for React 17's [new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 
which no longer requires `React` to be in scope wherever JSX is used.
