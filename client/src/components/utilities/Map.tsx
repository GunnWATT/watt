import React, { useEffect, useState, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';

import GunnMapImage from '../../assets/gunnmap.png';
import UserDataContext from '../../contexts/UserDataContext';

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

    setTranslate(x:number,y: number) {
        this.matrix.set(0, 2, x);
        this.matrix.set(1, 2, y);
    }

    getTranslate() {
        return {
            x: this.matrix.get(0,2),
            y: this.matrix.get(1,2)
        }
    }

    dilate(factor:number) {
        this.matrix = this.matrix.multiply(new Matrix([[factor, 0, 0], [0,factor,0], [0,0,1]]));
    }

    toString() {
        return `matrix(${this.matrix.get(0, 0)}, ${this.matrix.get(0, 1)}, ${this.matrix.get(1, 0)}, ${this.matrix.get(1, 1)}, ${this.matrix.get(0, 2)}, ${this.matrix.get(1, 2)})`
    }

    copy() {
        let c = new Transform(1,0,0,1,0,0);
        c.matrix = this.matrix.copy();
        return c;
    }
}

const Map = () => {
    const [map, setMap] = useState<JSX.Element | null>(null);
    let pos = (new Transform(1, 0, 0, 1, window.innerWidth/2, window.innerHeight/2));
    let dragging: {simpleDrag: boolean, singleClick?: boolean, sx:number, sy:number, t: Transform, sx2?: number, sy2?: number}|null = (null);

    // const [gunnMap, setGunnMap] = useState<JSX.Element | null>(null)
    const mapRef = useRef<null|HTMLImageElement>(null);

    const userData = useContext(UserDataContext);

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

    useEffect(() => setMap(ReactDOM.createPortal(
        <img src={GunnMapImage} ref={mapRef} draggable={false} alt="" style={{
            position: "fixed",
            width: '1000px',
            transform: `translate(-50%, -50%) ${pos.toString()}`,
            left: 0,
            top: 100,
            maxHeight: '100vh',
            maxWidth: '100%',
            filter: userData.options.theme === "dark" ? 'invert(1)' : ''
        }} />,
        document.getElementById('content')!)), 
        [])
    
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current!.addEventListener('mousedown', (e) => {
                dragging = ({ simpleDrag: true, sx: e.clientX, sy: e.clientY, t: pos.copy() });
            })
            mapRef.current!.addEventListener('mousemove', (e) => {
                if (dragging && dragging.simpleDrag && mapRef.current) {
                    (pos.setTranslate(e.clientX - dragging.sx + dragging.t.getTranslate().x, e.clientY - dragging.sy + dragging.t.getTranslate().y));
                    mapRef.current.style.transform = `translate(-50%, -50%) ${pos.toString()}`;
                }
            })
            mapRef.current.addEventListener('mouseup', () => {
                dragging = null;
            })
            mapRef.current.addEventListener('wheel', (e) => {
                //@ts-ignore
                pos.dilate(Math.pow(1.002, -e.deltaY))
                if (mapRef.current) mapRef.current.style.transform = `translate(-50%, -50%) ${pos.toString()}`;
                e.preventDefault();
            })

            mapRef.current.addEventListener('touchstart', (e) => {
                if (dragging) {
                    dragging.simpleDrag = false;
                    dragging.sx = e.touches[0].clientX;
                    dragging.sy = e.touches[0].clientY;
                    dragging.sx2 = e.touches[1].clientX;
                    dragging.sy2 = e.touches[1].clientY;
                    dragging.t = pos.copy();
                } else {
                    dragging = ({ simpleDrag: true, sx: e.touches[0].clientX, sy: e.touches[0].clientY, t: pos.copy() });
                }
            })

            mapRef.current.addEventListener('touchmove', (e) => {
                if (dragging && dragging.simpleDrag && mapRef.current) {
                    (pos.setTranslate(e.touches[0].clientX - dragging.sx + dragging.t.getTranslate().x, e.touches[0].clientY - dragging.sy + dragging.t.getTranslate().y));
                    mapRef.current.style.transform = `translate(-50%, -50%) ${pos.toString()}`;
                    e.preventDefault();
                }

                if (dragging && !dragging.simpleDrag && mapRef.current && dragging.sx2 && dragging.sy2) {
                    // ruh roh
                    // have to find some way to map from (sx,sy) and (sx2,sy2) to (nx,ny) and (nx2, ny2) respectively using an affine transformation
                    const { sx, sy, sx2, sy2 } = dragging;
                    const [nx, ny, nx2, ny2] = [e.touches[0].clientX, e.touches[0].clientY, e.touches[1].clientX, e.touches[1].clientY];

                    const deg = Math.atan2(sy2 - sy, sx2 - sx) - Math.atan2(ny2 - ny, nx2 - nx);
                    const scale = Math.sqrt((nx2 - nx) ** 2 + (ny2 - ny) ** 2) / Math.sqrt((sx2 - sx) ** 2 + (sy2 - sy) ** 2)
                    const trans = new Transform(1, 0, 0, 1, nx, ny);
                    const ntrans = new Transform(1, 0, 0, 1, -sx, -sy);
                    const rotandscale = new Transform(scale * Math.cos(deg), -scale * Math.sin(deg), scale * Math.sin(deg), scale * Math.cos(deg), 0, 0);

                    // math
                    // first apply previous transform
                    // then apply the affine transformation
                    pos.matrix = trans.matrix.multiply(rotandscale.matrix).multiply(ntrans.matrix).multiply(dragging.t.matrix);
                    mapRef.current.style.transform = `translate(-50%, -50%) ${pos.toString()}`;

                    e.preventDefault();
                }
            })

            mapRef.current.addEventListener('touchend', (e) => {
                dragging = null;
            })

        }

    }, [mapRef, map])

    return (
        <>
            <h1>Map</h1>
            <p>Use the mouse to pan and ctrl+scroll to zoom.</p>
            {map}
            
        </>
    );
}

export default Map;