

import './App.css'

export default function CommandsModal(props){



    return(
        <div className={`modalCommands flex-center ${props.visivel ? "visivel" : ""}`}>


        {props.modo == 'add' &&
        <pre style={{width:"auto", alignItems:"start", display:"flex"}}>
            {`
async function adicionarLivro(){

    await addDoc(collection(db, ${props.colecao}), {
        titulo: ${props.titulo},
        autor: ${props.autor}
    })

    settitulo('')
    setAutor('')

    getLivros() // <- atualiza a lista de livros
}
            `}
        </pre>}

        {props.modo == 'delete' &&
        <pre style={{width:"auto", alignItems:"start", display:"flex"}}>
            {`
async function excluir(*idDoLivro){

    await deleteDoc(doc(db, colecao, *idDolivro))

    getLivros()
}
            `}
        </pre>}


        </div>
    )
}