const pdfRobotica = '../../public/certificados/Certificado_robotica.pdf';
const imgRobotica = '../../public/images/Certificado_robotica.png';
const pdfWeMakeSoftware = '../../public/certificados/Certificado-Wemakesoftware1.pdf';
const imgWeMakeSoftware = '../../public/images/Certificado-Wemakesoftware1.png';
const pdfDestaqueSesi = '../../public/Certificados/Aluno_Destaque_SESI_1_2_3_ano.pdf';
const imgDestaqueSesi = '../../public/images/Certificado_sesi.png';
const pdfSenai = '../../public/Certificados/Senai.pdf';
const imgSenai = '../../public/images/Senai.png';
export const certificados = [
    {
    id: 'fll',
    nome: 'Torneio SESI de Robótica- First Lego League (FLL)',
    instituicao: 'SESI Alvimar Carneiro de Rezende',
    data: '2023',
    arquivo: pdfRobotica,
    previa: imgRobotica,
    },
    {
    id:'We Make Software-Estagi.ON',
    nome: 'We Make Software-2026/1',
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
