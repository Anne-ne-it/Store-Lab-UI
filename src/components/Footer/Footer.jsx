/*FOOTER importa estilos css desde './Footer.module.css' y crea la función Footer para renderizar el pie de página*/

import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <section className={styles.benefits}>

                <div>
                    <span>〰</span>
                    <div>
                        <strong>Pasión por el mar</strong>
                        <p>Vivimos lo que vendemos.</p>
                    </div>
                </div>

                <div>
                    <span>◇</span>
                    <div>
                        <strong>Calidad garantizada</strong>
                        <p>Productos seleccionados.</p>
                    </div>
                </div>

                <div>
                    <span>▱</span>
                    <div>
                        <strong>Envíos rápidos</strong>
                        <p>24/48h en toda la península.</p>
                    </div>
                </div>

                <div>
                    <span>☺</span>
                    <div>
                        <strong>Atención personalizada</strong>
                        <p>Estamos aquí para ayudarte.</p>
                    </div>
                </div>

            </section>
        </footer>
    )
}

export default Footer;