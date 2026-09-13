import styles from './Footer.module.css'; //Importa los estilos CSS específicos para este componente utilizando módulos CSS de React

// Define el componente funcional 'Footer'
function Footer() {
    return (
        <footer className={styles.footer}>
            {/*Sección contenedora principal para mostrar la lista de beneficios*/}
            <section className={styles.benefits}>

                {/*Primer beneficio: Pasión por el mar*/}
                <div>
                    {/*Ícono o símbolo decorativo*/}
                    <span>〰</span>
                    <div>
                        {/*Título en negrita del beneficio*/}
                        <strong>Pasión por el mar</strong>
                        {/*Descripción breve*/}
                        <p>Vivimos lo que vendemos.</p>
                    </div>
                </div>

                {/*Segundo beneficio: Calidad garantizada*/}
                <div>
                    <span>◇</span>
                    <div>
                        <strong>Calidad garantizada</strong>
                        <p>Productos seleccionados.</p>
                    </div>
                </div>

                {/*Tercer beneficio: Envíos rápido */}
                <div>
                    <span>▱</span>
                    <div>
                        <strong>Envíos rápidos</strong>
                        <p>24/48h en toda la península.</p>
                    </div>
                </div>

                {/*Cuarto beneficio: Atención personalizada*/}
                <div>
                    <span>☺</span>
                    <div>
                        <strong>Atención personalizada</strong>
                    </div>
                </div>

            </section>
        </footer>
    )
}

export default Footer; //Exporta el componente para que pueda ser importado y usado en otros archivos de la aplicación
