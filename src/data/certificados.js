const pdfRobotica = 'Certificados/Certificado_robotica.pdf';
const imgRobotica = 'images/Certificado_robotica.png';
const pdfWeMakeSoftware = 'Certificados/Certificado-Wemakesoftware1.pdf';
const imgWeMakeSoftware = 'images/Certificado-Wemakesoftware1.png';
const pdfDestaqueSesi = 'Certificados/Aluno_Destaque_SESI_1_2_3_ano.pdf';
const imgDestaqueSesi = 'images/Certificado_sesi.png';
const pdfSenai = 'Certificados/Senai.pdf';
const imgSenai = 'images/Senai.png';
export const certificados = [
    {
    id: 'fll',
    nome: 'Torneio SESI de Robótica - First Lego League (FLL)',
    instituicao: 'SESI Alvimar Carneiro de Rezende',
    data: '2023',
    arquivo: pdfRobotica,
    previa: imgRobotica,
    },
    {
    id:'We Make Software-Estagi.ON',
    nome: 'We Make Software - 2026/1',
    instituicao: 'Pontifícia Universidade Católica de Minas Gerais',
    data: '2026',
    arquivo: pdfWeMakeSoftware,
    previa: imgWeMakeSoftware,
    },
    {
        id: 'aluno-destaque',
        nome: 'Aluno Destaque — 1º ao 3º ano do Ensino Médio',
        instituicao: 'SESI Alvimar Carneiro de Rezende',
        data: '2023 — 2025',
        arquivo: pdfDestaqueSesi,
        previa: imgDestaqueSesi,
    },
    {
        id: 'senai',
        nome: 'Curso Profissionalizante de Manutenção de Máquinas Industriais',
        instituicao: 'SENAI',
        data: '2024',
        arquivo: pdfSenai,
        previa: imgSenai,
    }
]
