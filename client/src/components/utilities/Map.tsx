import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import gunnmapimg from '../../assets/gunnmap.png';

// Pay attention in 'nal kids
class Matrix {
    private arr:number[][];
    private readonly r:number;
    private readonly c:number;
    constructor(arr: number[][]) {
        this.arr = arr;
        this.r = arr.length;
        this.c = arr[0].length;
    }

    get(i:number,j:number){
        return this.arr[i][j];
    }

    set(i:number, j:number, v:number) {
        this.arr[i][j] = v;
    }

    multiply(m: Matrix): Matrix {
        if(this.c !== m.r) throw "Incompatible Matrices!";

        const R = this.r;
        const C = m.c;
        const A = this.c; // = m.r
        let newMat = Array(R).fill(0).map(() => Array(C)); // create a R x C array

        // uncool n^3 algo
        for(let i = 0; i < R; i++) {
            for(let j = 0; j < C; j++) {
                let sum = 0;

                for(let k = 0; k < A; k++) {
                    sum += this.arr[i][k] * m.arr[k][j];
                }

                newMat[i][j] = sum;
            }
        }

        return new Matrix(newMat);
    }

    // DESTRUCTIVE
    // DESTRUCTIVE!!!!
    private rowOp(rFrom:number, factor:number, rTo:number) {
        for(let i = 0; i < this.c; i++) {
            this.arr[rTo][i] += this.arr[rFrom][i] * factor;
        }
    }
    private rowMult(r: number, factor:number) {
        for(let i = 0; i < this.c; i++) {
            this.arr[r][i] *= factor;
        }
    }

    inv() {
        if(this.r !== this.c) throw "Bruh";
        // Gauss Jordan Elim

        let m = this.copy();

        let id: number[][] = [];
        for(let i = 0; i < m.r; i++) {
            id.push([]);
            for (let j = 0; j < m.c; j++) {
                id[i].push(i === j ? 1 : 0);
            }
        }

        let inv = new Matrix(id);
        
        for(let j = 0; j < m.c; j++) {
            for (let i = 0; i < m.r; i++) {
                if(i === j) {
                    // ideally turns into 1
                    if(m.arr[i][j] === 0) {
                        // uh oh!
                        let doom = true;
                        for(let r = 0; r < m.r; r++) {
                            if(r === i) continue;
                            if(m.arr[r][j] !== 0) {
                                inv.rowOp(r, 1, i);
                                m.rowOp(r, 1, i); // make it not 1
                                
                                doom = false;
                                break;
                            }
                        }

                        if(doom) {
                            throw "Non Invertible Matrix!";
                        }
                    }

                    // scale
                    inv.rowMult(i, 1 / m.arr[i][j]);
                    m.rowMult(i, 1/m.arr[i][j]);
                } else {
                    // turns into 0
                    // kill it with fire
                    let doom = true;
                    for (let r = 0; r < m.r; r++) {
                        if(r === i) continue;
                        if (m.arr[r][j] !== 0) {
                            inv.rowOp(r, -m.arr[i][j] / m.arr[r][j], i);
                            m.rowOp(r, -m.arr[i][j]/m.arr[r][j], i); // kill
                            
                            doom = false;
                            break;
                        }
                    }

                    if(doom) {
                        throw "Non Invertible Matrix!";
                    }
                }
            }
        }

        return inv;
    }

    getRaw():number[][] {
        return this.arr.map(row => row.map(datum => datum));
    }
    copy() {
        return new Matrix(this.getRaw());
    }
}

class Transform {
    public matrix: Matrix;
    // public inv: Matrix;
    constructor(a:number,b:number,c:number,d:number,x:number,y:number) {
        this.matrix = new Matrix([[a,b,x], [c,d,y], [0,0,1]]);
        // this.inv = this.matrix.inv();
    }
 
    apply(x:number,y:number) {
        let result = this.matrix.multiply(new Matrix([[x],[y],[1]])).getRaw();
        return {
            x: result[0],
            y: result[1]
        }
    }

    getOrigPoint(x:number, y:number) {
        let result = this.matrix.inv().multiply(new Matrix([[x], [y], [1]])).getRaw();
        return {
            x: result[0],
            y: result[1]
        }
    }

    setTranslate(x:number,y: number) {
        this.matrix.set(0, 2, x);
        this.matrix.set(1, 2, y);
        return this;
    }

    getTranslate() {
        return {
            x: this.matrix.get(0,2),
            y: this.matrix.get(1,2)
        }
    }

    toString() {
        return `matrix(${this.matrix.get(0, 0)}, ${this.matrix.get(0, 1)}, ${this.matrix.get(1, 0)}, ${this.matrix.get(1, 1)}, ${this.matrix.get(0, 2)}, ${this.matrix.get(1, 2)})`
    }
}

// let m1 = new Matrix([[1,2],[3,4]]);
// let m2 = new Matrix([[0,1], [2,3]]);
// console.log(m1.multiply(m2).getRaw());

const Map = () => {
    const [map, setMap] = useState<JSX.Element | null>(null);
    const [pos, setPos] = useState<Transform>(new Transform(1, 0, 0, 1, 500, 500));
    const [dragging, setDragging] = useState<{touch: boolean, sx:number, sy:number, tx:number, ty:number}|null>(null);
    // const [gunnMap, setGunnMap] = useState<JSX.Element | null>(null);

    // Render the portal in the useEffect to guarantee that all elements have been rendered into the DOM and
    // document.getElementById('content') is not null
    // useEffect(() => setMap(ReactDOM.createPortal(
    //     <iframe
    //         className="map"
    //         width="100%"
    //         title="google-map"
    //         frameBorder="0"
    //         // src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCy3pN97ODnqOMvoGABYhN3bM4-qkro-eg&q=Henry+M+Gunn+High+School"
    //         src="https://desmos.com/calculator" // Use desmos embed for testing, since the google map blocks localhost
    //         allowFullScreen>
    //     </iframe>

        
    //     ,
    //     document.getElementById('content')!
    // )), [])
    
    return (
        <>
            <h1>Map</h1>
            <p>Use the mouse to pan and ctrl+scroll to zoom.</p>
            {map}

            <img src={gunnmapimg} alt="" style={{
                position: "absolute",
                width: 1000,
                transform: `translate(-50%,-50%) ${pos.toString()}`,
                left: 0,
                top: 0,
                
            }} draggable={false} onMouseDown={(e) => {
                setDragging({touch: false, sx: e.clientX, sy: e.clientY, tx: pos.getTranslate().x, ty: pos.getTranslate().y});
            }} onMouseMove={(e) => {
                // console.log(pos.setTranslate(e.clientX, e.clientY));
                console.log("hi");
                if(dragging && !dragging.touch) setPos(pos.setTranslate(e.clientX - dragging.sx + dragging.tx, e.clientY - dragging.sy + dragging.ty));
            }} onMouseUp={() => {
                setDragging(null);
            }} />
        </>
    );
}

export default Map;