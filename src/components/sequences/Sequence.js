import React, { useContext, useEffect, useState } from "react"
import { MatrixGenerator } from "../matrix/MatrixGenerator";
import { SequenceContext } from "./SequenceProvider";

export const Sequence = () => {
    const {sequences, getSequences} = useContext(SequenceContext)
    const [sequence, setSequence] = useState();
    const sequenceId = 1

    useEffect(()=>{
        getSequences().then(()=>{

        })
    },[])

    
    return (
        sequences.map(sequence => {
            <MatrixGenerator key={sequence.id} sequence={sequence.pattern}/>
        }
        )
    )  
}
