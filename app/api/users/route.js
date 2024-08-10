import { collection, getDocs,doc,setDoc } from "firebase/firestore";
import { db } from "../../../src/firebase/config";
import { NextResponse } from "next/server";
import { auth } from "../../../src/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth"

export const GET = async () =>{
    try{
      const productosRef = collection(db, "users")
      const querySnapshot = await getDocs (productosRef)
      const docs = querySnapshot.docs. map (doc => doc.data())
      return NextResponse.json(docs)
    }
    catch(error){
        console.log(error)
    }
}


export const POST = async (request) => {
try{
    const userData = await request.json()
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
    const userUid = userCredential.user.uid

    if(userCredential?.user?.email == userData.email){
        delete userData.password
        userData.cart=userUid
        userData.tickets=userUid
        userData.role= userData.email === "user"
        const docRefUser = doc(db,"users", userUid)
        await setDoc(docRefUser,{...userData}).then(()=>console.log("Usuario creado"))
      
        const docRefCart = doc(db,"carts", userUid)
        await setDoc(docRefCart, { items: [] });

      return NextResponse.json({message:"usuario creado"},{status:201});
    }
    else{
        return NextResponse.json({message:"no se creo el usuario"},{status:400});

    }

    } catch (error) {
      console.log(error);
      throw error
    }
};