import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Injectable()
export class AppareilService {
    uld!: any;
    private appareils: any[] = [];
    appareilsSubject = new Subject<any[]>();

    constructor(private httpClient: HttpClient) {
        this.uld = firebase.auth().currentUser?.uid;
    }

    getAllAppareil(): any[] {
        return this.appareils;
    }

    getAppareilById(id: number) {
        const appareil = this.appareils.find( // cette méthode parcours le tableau
            (s) => { // s correspond à l'objet du tableau à chaque passage de la boucle
                return s.id === id; // si l'id de l'objet correspond à l'id passé en paramètre, on attribut l'objet à la constante appareil
            }
        );
        return appareil;
    }

    getAppareilsFromServer() {
        this.httpClient
        .get<any[]>('https://angular-tp-3b66d-default-rtdb.europe-west1.firebasedatabase.app/'+this.uld+'/appareils.json')
        .subscribe({
            next: (response) => {
                if (response) {
                    this.appareils = response;
                    this.emitAppareilSubject();
                }
            },
            error: (error) => console.log('Erreur de chargement des appareils depuis le serveur : ' + error),
            complete: () => console.info('Chargement des appareils terminé')
        });
    }

    /**
     * Cette méthode crée un objet du bon format et attribue le nom et le statut qui lui sont passés comme arguments.
     * La ligne pour l'id prend l'id du dernier élément actuel de l'array et ajoute 1.
     * Ensuite, l'objet complété est ajouté à l'array et le Subject est déclenché pour tout gardé à jour.
     * @param name string
     * @param status string
     */
    addAppareil(name: string, status: string) {
        const appareilObject = {
            id: 0,
            name: '',
            status: ''
        };
        appareilObject.name = name;
        appareilObject.status = status;
        if (this.appareils.length != 0) {
            appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;
        } else {
            appareilObject.id = 0;
        }
        this.appareils.push(appareilObject);
        this.emitAppareilSubject();
    }

    /**
     * .put() permet de lancer un appel POST, prend comme 1er argument l'URL visée et comme 2eme argument le corps de l'appel, c'est à dire ce qu'il faut envoer à l'URL, l'extension .json de l'URL est une spécificité de Firebase, pour lui dire que vous lui envoyer des données au format JSON.
     * la méthode put() retourne un Observable, c'est à dire un objet qui permet de suivre l'évolution de l'appel. Elle ne fait pas d'appel à elle toute seule, c'est en y souscrivant que l'appel est lancé.
     * dans la méthode subscribe() on prévoit le cas où tout fonctionne ainsi que le cas où le serveur renverrait une erreur. 
     */
    saveAppareilsToServer() {
        this.httpClient
        .put('https://angular-tp-3b66d-default-rtdb.europe-west1.firebasedatabase.app/'+this.uld+'/appareils.json', this.appareils)
        .subscribe({
            next: () => console.log('Enregistrement terminé !'),
            error: (error) => console.log('Erreur ! : ' + error),
            complete: () => console.log('Observable complete !')
        });
    }

    emitAppareilSubject() {
        this.appareilsSubject.next(this.appareils.slice());
    }

    switchOnAll() {
        for(let appareil of this.appareils) {
            appareil.status = 'allumé';
            this.emitAppareilSubject();
        }
    }

    switchOnOne(i: number) {
        this.appareils[i].status = 'allumé';
        this.emitAppareilSubject();
    }

    switchOffAll() {
        for(let appareil of this.appareils) {
            appareil.status = 'éteint';
            this.emitAppareilSubject();
        }
    }

    switchOffOne(i: number) {
        this.appareils[i].status = 'éteint';
        this.emitAppareilSubject();
    }
}