export const MONTHS = [
    { value: 'JANVIER', label: 'JANVIER' },
    { value: 'FEVRIER', label: 'FEVRIER' },
    { value: 'MARS', label: 'MARS' },
    { value: 'AVRIL', label: 'AVRIL' },
    { value: 'MAI', label: 'MAI' },
    { value: 'JUIN', label: 'JUIN' },
    { value: 'JUILLET', label: 'JUILLET' },
    { value: 'AOUT', label: 'AOUT' },
    { value: 'SEPTEMBRE', label: 'SEPTEMBRE' },
    { value: 'OCTOBRE', label: 'OCTOBRE' },
    { value: 'NOVEMBRE', label: 'NOVEMBRE' },
    { value: 'DECEMBRE', label: 'DECEMBRE' }
];

export type StatsDto = {
    numOfAppartements: number;
    numOfLocataires: number;
    numOfAllPaiements: number;
    numOfDeletedPaiements: number;
    numOfNotDeletedPaiements: number;
}

export interface Notification {
    id: string;
    action: string;
    description: string;
    entity: string;
    authorUsername: string;
    authorEmail: string;
    receiverUsername: string;
    receiverEmail: string;
    createdAt: string;
    viewed: boolean;
}

export type ListNotification = Notification[];


export const USER_DEFAULT_PICTURE_URL = "/images/user/user-default.png";