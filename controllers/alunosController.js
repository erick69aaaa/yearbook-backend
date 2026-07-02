import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// select que omite senhaHash — reutilizado em todas as queries de alunos
const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
  // senhaHash NÃO está aqui — nunca retornado pela API
};

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({
    select: selectSemSenha, // retorna todos os campos EXCETO senhaHash
  });
  res.json(alunos); // responde com o array de alunos em JSON
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res) {
  const { id } = req.params; // extrai o :id da URL
  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) }, // converte string → number
    select: selectSemSenha,    // omite senhaHash
  });

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' }); // null → 404
  }

  res.json(aluno); // retorna o aluno encontrado
}

// 🎯 POST /alunos — cria um novo aluno
export async function criarAluno(req, res) {
  const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;

  try {
    const alunoCriado = await prisma.aluno.create({
      data: {
        nome,
        email,
        senhaHash,
        cidade,
        frase,
        planosFuturos
      },
      select: selectSemSenha 
    });

    res.status(201).json(alunoCriado);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar aluno. Verifique os dados enviados.' });
  }
}

// 🎯 PUT /alunos/:id — atualiza um aluno existente
export async function atualizarAluno(req, res) {
  const { id } = req.params; // 1. Pega o ID da URL
  const dados = req.body;    // 2. Pega os dados do Body

  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) }, 
      data: dados,
      select: selectSemSenha
    });

    // Se deu certo, responde status 200 com o aluno
    return res.json(alunoAtualizado); 

  } catch (error) {
    // Se o ID não existir no banco, o Prisma cai aqui e manda o 404
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}

// 🎯 DELETE /alunos/:id — deleta um aluno
export async function deletarAluno(req, res) {
  const { id } = req.params; // 1. Pega o ID da URL

  try {
    // 2. O Prisma tenta deletar o registro
    await prisma.aluno.delete({
      where: { id: Number(id) }
    });

    // 3. Retorna o status 204 (Sem conteúdo) indicando sucesso total
    return res.status(204).end();

  } catch (error) {
    // Se o ID não existir, cai aqui e avisa o Bruno
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
}