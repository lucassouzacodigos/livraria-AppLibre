import { useEffect, useState } from 'react'

//Import do css
import './App.css'

//Import da variavel DB que vem do firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { collection, deleteDoc, doc, getDocs, addDoc } from 'firebase/firestore'
import CommandsModal from './CommandsModal'





export default function App() {
  

  //useState onde serao guardados os dados dos livros
  const [livros, setLivros] = useState([])

  //useState para guardar os dados do livro
  //e adiciona-lo ao banco
  const [titulo, settitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [colecao, setColecao] = useState('')

  //Abre o menu de configurações
  const [modalOpen, setModalOpen] = useState(false)
  //Mostra o comando que vai ser executado
  const [showCommand, setShowCommand] = useState(false)
  const [modo, setModo] = useState("")
  
  //useState pra guardar os dados do firebase
  const [firebaseconfigs, setFirebaseconfigs] = useState('')

  // Função para pegar as informações do Firebase
  async function getLivros() {

  if(!firebaseconfigs.apiKey) return

  const app = initializeApp(firebaseconfigs)

  const db = getFirestore(app)

  const snapshot = await getDocs(collection(db, colecao))

  const livros = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  setLivros(livros)

  console.log(livros)
}

  
  //Funcao para excluir 1 livro do Firebase
  async function excluir(id){

  const app = initializeApp(firebaseconfigs)

  const db = getFirestore(app)

  await deleteDoc(doc(db, colecao, id))

  getLivros()
}

  //Funcao para adicionar o livro no banco
  async function adicionarLivro(){

  if(!firebaseconfigs.apiKey){
    alert('Configure o Firebase primeiro')
    return
  }

  if(titulo === '' && autor === '' || colecao === ''){
    alert('Preencha os campos corretamente')
    return
  }

  const app = initializeApp(firebaseconfigs)

  const db = getFirestore(app)

  await addDoc(collection(db, colecao), {
    titulo: titulo,
    autor: autor
  })

  settitulo('')
  setAutor('')

  getLivros()
}

  function openModal(){
    setModalOpen(!modalOpen)
  }

function extrairFirebaseConfig(texto){

  try{

    const regex = /const firebaseConfig = ({[\s\S]*?});/

    const resultado = texto.match(regex)

    if(!resultado){
      alert('Config não encontrada')
      return
    }

    const objetoTexto = resultado[1]

    // converte texto em objeto JS
    const objeto = new Function(`return ${objetoTexto}`)()

    setFirebaseconfigs(objeto)

    console.log(objeto)

    // alerta
    alert('Firebase salvo com sucesso')

    // fecha modal
    setModalOpen(false)

  }catch(err){
    console.log(err)
    alert('Erro ao extrair config')
  }
}






  // useEffect, roda toda vez que a pagina é carregada
  // para pegar os dados do Firebase
  useEffect(() => {

  if(firebaseconfigs.apiKey){
    getLivros()
  }

}, [firebaseconfigs])





  //Render da pagina
  return(
    <div className='app flex-center'>
      <h1>Exemplo CRUD Firebase</h1>
      <h2>Livraria App-Libre</h2>

      <div className='addLivro flex-center'>
        <input value={colecao} onChange={(e) => setColecao(e.target.value)} type='text' placeholder='Collection onde salvar' style={{fontWeight:"bold", fontSize:15, textAlign:'center'}}></input>
        <input value={titulo} onChange={(e) => settitulo(e.target.value)} type='text' placeholder='Titulo do Livro'></input>
        <input value={autor} onChange={(e) => setAutor(e.target.value)} type='text' placeholder='Nome do Autor'></input>
        <button onMouseLeave={() => {setShowCommand(false)}} 
        onMouseEnter={() => {setShowCommand(true); setModo("add")}} className='botaoAdd' onClick={() => adicionarLivro()}>Adicionar Livro</button>      
      </div>

      {/* verifica se os livros estao presentes (se a length for maior que 0)
      e renderiza todos numa lista com a funcao map */}
      {
        livros.length > 0 ? 
        livros.map((livro) => {
          return(
            <div key={livro.id} className='livroContainer flex-center'>
              <h2>Título: {livro.titulo}</h2>
              <p>Autor: {livro.autor}</p>
              <button onMouseLeave={() => {setShowCommand(false)}} 
              onMouseEnter={() => {setShowCommand(true); setModo("delete")}} onClick={() => excluir(livro.id)} className='excluir'>X</button>
            </div>
          )
        }) : <p>Sem livros até o momento</p>
      }

      <div onClick={() => openModal()} className='configOpen flex-center'>
        <img style={{height:29, width:29}} src='https://cdn-icons-png.flaticon.com/128/8618/8618529.png'></img>
      </div>

      {/* tela para colar suas configurações do firebase */}
      {
        modalOpen &&
        <div className='modal flex-center'>
          <div className='content'>
          <button style={{backgroundColor:"red"}} onClick={() => setModalOpen(false)}>fechar</button>
            <textarea onChange={(e) => extrairFirebaseConfig(e.target.value)} className='firebaseconfigs' type="text" />
          </div>
        </div> 
      }

      {/* { exibe as config do firebase quando presentes */}
      {
        firebaseconfigs &&
        <div className='firebaseconfigs'>
          <p>API Key: {firebaseconfigs.apiKey}</p>
          <p>Auth Domain: {firebaseconfigs.authDomain}</p>
          <p>Project ID: {firebaseconfigs.projectId}</p>
          <p>Storage Bucket: {firebaseconfigs.storageBucket}</p>
          <p>Messaging Sender ID: {firebaseconfigs.messagingSenderId}</p>
          <p>App ID: {firebaseconfigs.appId}</p>
        </div>
      }

      {/* Modal que mostra o comando q vai ser executado quando algum elemento tiver o mouse emcima */}
      <CommandsModal modo={modo} visivel={showCommand} titulo={titulo} autor={autor} colecao={colecao}/>


    </div>
    
  )
}


