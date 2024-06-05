import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class ProfanityService {
    private readonly profanityWords: string[] = ['нецензурне1', 'нецензурне2', 'нецензурне3'];

    constructor() {}

    containsProfanity(text: string): boolean {
        const words = text.toLowerCase().split(/\s+/);
        for (const word of words) {
            if (this.profanityWords.includes(word)) {
                return true;
            }
        }
        return false;
    }
}
