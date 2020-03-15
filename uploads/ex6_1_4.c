#include <stdio.h>

#define tamanho(arr) sizeof(arr)/sizeof(arr[0])

void leVetor(int * vetor, int tamanho);
void printVetor(int * vetor, int tamanho);
void acederVetor(int * vetor, int tamanho, int posicao);
int posicaoVetor(int * vetor1, int posicao);
int somaVetor(int * vetor, int * vetor2, int * vetor3, int tamanho);

int main(void) {
    int tamanho;
    printf("Introduza o tamanho do vetor: ");
    scanf("%d", &tamanho);

    int vetor1[tamanho], vetor2[tamanho], vetor3[tamanho];
    printf("Primeiro vetor:\n");
    leVetor(vetor1, tamanho);
    printf("Segundo vetor:\n");
    leVetor(vetor2, tamanho);

    printf("Vetor soma:\n");
    somaVetor(vetor1, vetor2, vetor3, tamanho);
    printVetor(vetor3, tamanho);

    return 0;
}

void leVetor(int * vetor, int tamanho) {
    for(int i = 0; i < tamanho; i++) {
        printf("Introduza um valor: ");
        scanf("%d", (vetor + i));
    }
}

int somaVetor(int * vetor1, int * vetor2, int * vetor3, int tamanho) {
    for(int i = 0; i < tamanho; i++) {
        * (vetor3 + i) =  posicaoVetor(vetor1, i) + posicaoVetor(vetor2, i);
    }
}

int posicaoVetor(int * vetor, int posicao) {
    return * (vetor + posicao);
}

void printVetor(int * vetor, int tamanho) {
    for(int i = 0; i < tamanho; i++) {
        printf("Valor na posição %d: %d\n", i, posicaoVetor(vetor, i));
    }
}