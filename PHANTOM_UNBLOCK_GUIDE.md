# Como Desbloquear seu Domínio na Phantom Wallet

## Problema
Domínios novos são automaticamente bloqueados pela Phantom Wallet através do serviço Blowfish para proteger usuários contra sites maliciosos.

## Soluções

### 1. Solicitar Revisão no Blowfish (RECOMENDADO)

O Blowfish é o serviço de segurança usado pela Phantom. Você pode solicitar a remoção do seu domínio da lista de bloqueio:

1. Acesse: https://blowfish.xyz/
2. Procure por "Report False Positive" ou "Contact"
3. Envie uma solicitação explicando que:
   - Seu domínio: **cryptodustcleaner.xyz**
   - É uma aplicação legítima de limpeza de carteira Solana
   - Código open source disponível em: [seu-github-repo]
   - Apenas executa transações autorizadas pelo usuário

**Informações para incluir:**
- Domain: cryptodustcleaner.xyz
- Purpose: Solana wallet dust token cleaner
- GitHub: [link para seu repositório]
- Contact: [seu email]

### 2. Solicitar Revisão na Phantom

1. Clique em "Saiba mais" no aviso da Phantom
2. Use o formulário de contato da Phantom Support
3. Explique que é uma aplicação legítima

Link: https://help.phantom.app/hc/en-us/requests/new

### 3. Aguardar Construção de Reputação (2-4 semanas)

Domínios novos são marcados automaticamente. Após algumas semanas sem atividade suspeita, o domínio pode ser automaticamente removido das listas.

### 4. Testar Funcionalidade (Temporário)

Para validar que o código funciona enquanto aguarda o desbloqueio:

1. Na Phantom, clique em "Continuar na mesma (não seguro)"
2. Teste a funcionalidade de cleanup
3. **IMPORTANTE**: Apenas faça isso porque VOCÊ é o desenvolvedor e sabe que o código é seguro

### 5. Alternativa: Self-Hosting

Se você tem acesso a um servidor com domínio já estabelecido:

```bash
# Clone o repositório
git clone [seu-repo]
cd clean-dust-crypto

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Build e deploy
npm run build
npm start
```

Hospede em um domínio que você já possui há mais tempo.

## Timeline Esperado

- **Solicitação de Revisão**: 3-7 dias úteis para resposta
- **Reputação Natural**: 2-4 semanas
- **Self-hosting em domínio estabelecido**: Imediato

## Verificar Status do Domínio

Você pode verificar se seu domínio ainda está bloqueado em:
- https://blowfish.xyz/ (se tiverem ferramenta de verificação pública)
- Testando em uma carteira Phantom limpa

## Dicas para Acelerar o Processo

1. **Adicione informações de contato no site**
   - Página "About"
   - Links para GitHub
   - Email de contato profissional

2. **Melhore a transparência**
   - Link para código fonte
   - Documentação clara
   - Termos de uso

3. **Estabeleça presença online**
   - Twitter/X oficial
   - Discord ou Telegram
   - Documentação pública

## Prevenção Futura

Quando lançar novos domínios:

1. Use domínios com histórico limpo
2. Configure DNS, SSL e WHOIS antes de ativar funcionalidades de transação
3. Adicione conteúdo informativo antes de solicitar conexões de carteira
4. Entre em contato com serviços de segurança ANTES de lançar publicamente
