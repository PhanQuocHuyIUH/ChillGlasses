import {NextResponse} from "next/server"
export default function cmtproxy(){
    console.log("data")
    return NextResponse.json({data:"text"})
}