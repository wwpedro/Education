FROM node:20-alpine AS build

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (melhor cache)
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Faz o build do Next.js
RUN npm run build

# Imagem final
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia só o necessário
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
