# Guia de Deploy Forçado - Clean Dust Crypto

## Problema Identificado

O código está funcionando perfeitamente no preview do v0, mas não no domínio de produção (cryptodustcleaner.xyz). Isso acontece porque o deploy não está pegando as atualizações mais recentes do código.

## Solução: Deploy Forçado via GitHub

### Passo 1: Baixar o código atualizado do v0

1. No v0, clique nos 3 pontos no topo direito do projeto
2. Selecione "Download ZIP"
3. Extraia o ZIP em uma pasta no seu computador

### Passo 2: Fazer commit forçado no GitHub

```bash
# Entre na pasta extraída
cd clean-dust-crypto

# Inicialize git (se necessário)
git init

# Adicione o repositório remoto (substitua pelo seu repo)
git remote add origin https://github.com/seu-usuario/clean-dust-crypto.git

# Adicione todos os arquivos
git add .

# Faça commit com mensagem clara
git commit -m "Force update: Working swap implementation from v0"

# Force push para sobrescrever tudo
git push -f origin main
```

### Passo 3: Forçar redeploy na Vercel

1. Acesse https://vercel.com/dashboard
2. Vá no seu projeto "Clean Dust Crypto"
3. Clique na aba "Deployments"
4. Clique no último deployment
5. Clique nos 3 pontos e selecione "Redeploy"
6. Marque a opção "Use existing Build Cache" como **DESMARCADA** (importante!)
7. Clique em "Redeploy"

### Passo 4: Verificar deploy

Depois do deploy completar:

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Acesse cryptodustcleaner.xyz em aba anônima
3. Abra o Console do navegador (F12)
4. Conecte a carteira
5. Clique em "Clean Wallet Now"
6. Você DEVE ver logs começando com "[v0]" no console

### Logs esperados ao clicar em Clean:

```
[v0] BUTTON ONCLICK FIRED!!!
[v0] ========== DIRECT CLEANUP CLICKED ==========
[v0] Window location: https://cryptodustcleaner.xyz/
[v0] Dust tokens: 2
[v0] window.solana exists: true
[v0] window.solana.isPhantom: true
[v0] window.solana.isConnected: true
[v0] window.solana.publicKey: X...
```

Se você NÃO ver esses logs, o deploy não funcionou e o código antigo ainda está rodando.

## Alternativa: Deploy via Botão Publish do v0

1. No v0, clique no botão "Publish" no topo direito
2. Se já está conectado à Vercel, clique em "Update" 
3. Isso deve fazer push automático para o GitHub e triggerar deploy na Vercel
4. Aguarde o deploy completar (você verá um link quando terminar)
5. Teste no link fornecido

## Debug: Comparar código

Se continuar sem funcionar, compare os arquivos:

**No domínio de produção:**
1. Abra o Console (F12)
2. Vá na aba "Sources"
3. Navegue até `/components/cleanup-summary.tsx`
4. Verifique se tem os logs com "[v0]"

**Se não tiver:** O deploy não está funcionando corretamente

## Último recurso: Deploy do zero

1. Delete o projeto na Vercel
2. No v0, clique em "Publish" novamente
3. Conecte a um NOVO repositório GitHub
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_PROJECT_WALLET`
   - `NEXT_PUBLIC_SOLANA_RPC`
5. Aguarde o primeiro deploy
6. Teste no novo domínio

---

**IMPORTANTE:** O código está 100% funcional no preview do v0. O problema é apenas o deploy não estar aplicando as atualizações.
