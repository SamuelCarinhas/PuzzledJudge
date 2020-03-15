#include <stdio.h>

void converterLetras(char * string);

int main(void) {

    char string[81];
    printf("Introduza uma frase\n");
    scanf("%[^\n]s", string);

    converterLetras(string);

    printf("%s\n", string);

    return 0;
}

void converterLetras(char * string) {
    int i = 0;
    unsigned char atual;
    while((atual = string[i++]) != '\0') {
        if('a' <= atual && atual <= 'z') string[i-1] = atual - ('a' - 'A');
    }
}