import * as dotenv from "dotenv";
import * as path from "path";

export const envSetup = () => {
    dotenv.config({
        path: path.resolve(
            process.env.NODE_ENV === 'product' ? '.env.product' :
                process.env.NODE_ENV === 'develop' ? '.env.develop' : '.env.local'
        )
    });
}