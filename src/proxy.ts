import {NextResponse} from "next/server"
export default function proxy(){
    console.log("data")
    return NextResponse.json({data:"text"})
}