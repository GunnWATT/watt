import {useContext, useEffect, useRef, useState, PointerEvent} from 'react';
import {Button} from 'reactstrap';
import {useHotkeys} from 'react-hotkeys-hook';

import RedBackground from '../layout/RedBackground';

import GunnMapImage from '../../assets/gunnmap.png';
import UserDataContext from '../../contexts/UserDataContext';


type Pointer = {
    id: number,
    initX: number, initY: number,
    lastX: number, lastY: number,
    transformation?: Matrix,
    other?: Pointer | null
}
type ImageMapProps = {close: () => void};
export default function ImageMap(props : ImageMapProps) {
    const {close} = props;
    const userData = useContext(UserDataContext);

    // Refs, pointers, and transformations for manipulating the map image
    const mapRef = useRef<HTMLImageElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [pointer, setPointer] = useState<Pointer | null>(null);
    const [transformation, setTransformation] = useState(identity());

    useEffect(() => {
        // Unideal, but https://github.com/facebook/react/issues/14856 forces this
        // onWheel and onTouchMove are both passive event listeners so preventDefault does not work within them
        mapRef.current?.addEventListener('wheel', (e) => e.preventDefault());
    }, [mapRef])

    // Hotkey for closing map overlay
    useHotkeys('escape', close);

    // When a pointer deactivates
    const pointerEnd = (e: PointerEvent<HTMLImageElement>) => {
        if (pointer?.id === e.pointerId) {
            if (pointer.other) {
                // Make the other pointer the primary pointer now
                setPointer({
                    ...pointer.other,
                    initX: pointer.other.lastX,
                    initY: pointer.other.lastY,
                    transformation,
                    other: null
                })
            } else {
                setPointer(null);
            }
        } else if (pointer?.other?.id === e.pointerId) {
            pointer.initX = pointer.lastX
            pointer.initY = pointer.lastY
            pointer.other = null
            pointer.transformation = transformation
        }
    }

    return (
        <div className="bg-background dark:bg-background-dark fixed w-full h-full top-0 left-0 touch-none z-20">
            <RedBackground />
            <Button close className="absolute top-8 right-8" onClick={close} />

            <div
                className="flex w-full h-full overflow-hidden"
                ref={wrapperRef}
                onPointerDown={(e) => {
                    if (pointer) {
                        if (!pointer.other) {
                            setPointer({
                                ...pointer,
                                initX: pointer.lastX,
                                initY: pointer.lastY,
                                transformation,
                                other: {
                                    id: e.pointerId,
                                    initX: e.clientX,
                                    initY: e.clientY,
                                    lastX: e.clientX,
                                    lastY: e.clientY
                                }
                            })
                            e.currentTarget.setPointerCapture(e.pointerId)
                        }
                    } else {
                        setPointer({
                            id: e.pointerId,
                            initX: e.clientX,
                            initY: e.clientY,
                            lastX: e.clientX,
                            lastY: e.clientY,
                            transformation,
                            other: null
                        })
                        e.currentTarget.setPointerCapture(e.pointerId)
                    }
                }}
                onPointerMove={(e) => {
                    if (pointer?.id === e.pointerId || pointer?.other?.id === e.pointerId) {
                        if (pointer.id === e.pointerId) {
                            pointer.lastX = e.clientX;
                            pointer.lastY = e.clientY;
                        } else if (pointer.other) {
                            pointer.other.lastX = e.clientX;
                            pointer.other.lastY = e.clientY;
                        }
                        if (pointer.other) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const initXDiff = pointer.initX - pointer.other.initX;
                            const initYDiff = pointer.initY - pointer.other.initY;
                            const currentXDiff = pointer.lastX - pointer.other.lastX;
                            const currentYDiff = pointer.lastY - pointer.other.lastY;
                            // Difference between the angles of the initial and current line
                            // between the pointers.
                            const angleDiff =
                                Math.atan2(currentYDiff, currentXDiff) -
                                Math.atan2(initYDiff, initXDiff);
                            // Distance between the pointers relative to their initial distance.
                            const scale =
                                Math.hypot(currentXDiff, currentYDiff) /
                                Math.hypot(initXDiff, initYDiff);
                            // Midpoint between the two pointers.
                            const midX = (pointer.lastX + pointer.other.lastX) / 2;
                            const midY = (pointer.lastY + pointer.other.lastY) / 2;
                            // Offset of current midpoint from initial midpoint.
                            const deltaX = midX - (pointer.initX + pointer.other.initX) / 2;
                            const deltaY = midY - (pointer.initY + pointer.other.initY) / 2;
                            // Centre of rotation/dilation
                            const centreX = midX - (rect.left + rect.width / 2);
                            const centreY = midY - (rect.top + rect.height / 2);
                            setTransformation(multiply(
                                // Rotate and scale around midpoint
                                translate(centreX, centreY),
                                rotate(angleDiff),
                                dilate(scale),
                                translate(-centreX, -centreY),
                                translate(deltaX, deltaY),
                                pointer.transformation!
                            ));
                        } else {
                            setTransformation(multiply(
                                translate(e.clientX - pointer.initX, e.clientY - pointer.initY),
                                pointer.transformation!
                            ))
                        }
                        //mapRef.current!.style.transform = toCss(transformation);
                    }
                }}
                onPointerUp={pointerEnd}
                onPointerCancel={pointerEnd}
                onWheel={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centreX = e.clientX - (rect.left + rect.width / 2);
                    const centreY = e.clientY - (rect.top + rect.height / 2);
                    setTransformation(multiply(
                        translate(centreX, centreY),
                        // Thanks Roger!
                        dilate(1.001 ** -e.deltaY),
                        translate(-centreX, -centreY),
                        transformation
                    ))
                    //mapRef.current!.style.transform = toCss(transformation);
                }}
            >
                <img
                    src={GunnMapImage}
                    ref={mapRef}
                    draggable={false}
                    alt="Gunn map"
                    className="m-auto shadow-lg dark:invert dark:shadow-white max-h-[90vh] max-w-[90%]"
                    style={{ transform: toCss(transformation) }}
                />
            </div>
        </div>
    )
}

type MatrixRow = [number, number, number];
type Matrix = [MatrixRow, MatrixRow, MatrixRow];

const identity = (): Matrix => [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]
const translate = (x: number, y: number): Matrix => [
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
]
const rotate = (angle: number): Matrix => [
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle), Math.cos(angle), 0],
    [0, 0, 1]
]
const dilate = (scaleFactor: number): Matrix => [
    [scaleFactor, 0, 0],
    [0, scaleFactor, 0],
    [0, 0, 1]
]

const toCss = ([[a, c, x], [b, d, y]]: Matrix) => `matrix(${a}, ${b}, ${c}, ${d}, ${x}, ${y})`;

function multiply(matrix1: Matrix, ...matrices: Matrix[]): Matrix {
    if (matrices.length === 0) return matrix1;

    const matrix2 = multiply(matrices[0], ...matrices.slice(1));
    if (matrix1[0].length !== matrix2.length)
        throw new Error(`Left operand's row count (${matrix1[0].length}) is not equal to the right operand's column count (${matrix2.length}).`)

    const product = Array.from(
        { length: matrix1.length },
        () => new Array(matrix2[0].length)
    ) as Matrix;

    for (let row = 0; row < matrix1.length; row++) {
        for (let col = 0; col < matrix2[0].length; col++) {
            let sum = 0;
            for (let i = 0; i < matrix2.length; i++) {
                sum += matrix1[row][i] * matrix2[i][col];
            }
            product[row][col] = sum;
        }
    }
    return product;
}
