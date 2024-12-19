// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // 存储统计数据
    let statistics = {
        genotypes: {},
        phenotypes: {}
    };

    // 生成随机基因
    function randomGene(gene1, gene2) {
        return Math.random() < 0.5 ? gene1 : gene2;
    }

    // 形成雌配子
    document.getElementById('female-gamete-btn').addEventListener('click', () => {
        console.log('Female gamete button clicked');
        const femaleY = randomGene('Y', 'y');
        const femaleR = randomGene('R', 'r');
        
        const femaleYBox = document.getElementById('female-y-box');
        const femaleRBox = document.getElementById('female-r-box');
        const femaleGamete = document.getElementById('female-gamete');
        
        console.log('Female boxes:', femaleYBox, femaleRBox, femaleGamete);
        
        if (femaleYBox) femaleYBox.textContent = femaleY;
        if (femaleRBox) femaleRBox.textContent = femaleR;
        if (femaleGamete) femaleGamete.textContent = femaleY + femaleR;
    });

    // 形成雄配子
    document.getElementById('male-gamete-btn').addEventListener('click', () => {
        console.log('Male gamete button clicked');
        const maleY = randomGene('Y', 'y');
        const maleR = randomGene('R', 'r');
        
        const maleYBox = document.getElementById('male-y-box');
        const maleRBox = document.getElementById('male-r-box');
        const maleGamete = document.getElementById('male-gamete');
        
        console.log('Male boxes:', maleYBox, maleRBox, maleGamete);
        
        if (maleYBox) maleYBox.textContent = maleY;
        if (maleRBox) maleRBox.textContent = maleR;
        if (maleGamete) maleGamete.textContent = maleY + maleR;
    });

    // 合并配子
    function combineGametes(female, male) {
        const genes = (female + male).split('');
        const sortedGenes = [];
        
        // 排序Y/y
        const yGenes = genes.filter(g => g.toLowerCase() === 'y').sort();
        // 排序R/r
        const rGenes = genes.filter(g => g.toLowerCase() === 'r').sort();
        
        return yGenes.join('') + rGenes.join('');
    }

    // 确定表型
    function determinePhenotype(genotype) {
        const hasY = genotype.includes('Y');
        const hasR = genotype.includes('R');
        
        if (hasY && hasR) return '黄圆';
        if (hasY && !hasR) return '黄皱';
        if (!hasY && hasR) return '绿圆';
        return '绿皱';
    }

    // 完成受精
    document.getElementById('fertilization-btn').addEventListener('click', () => {
        console.log('Fertilization button clicked');
        const femaleGamete = document.getElementById('female-gamete').textContent;
        const maleGamete = document.getElementById('male-gamete').textContent;
        
        if (femaleGamete && maleGamete) {
            const f2Genotype = combineGametes(femaleGamete, maleGamete);
            const f2Result = document.getElementById('f2-result');
            const phenotypeResult = document.getElementById('phenotype-result');
            
            if (f2Result) f2Result.textContent = f2Genotype;
            
            // 更新表型
            const phenotype = determinePhenotype(f2Genotype);
            if (phenotypeResult) phenotypeResult.textContent = phenotype;
            
            // 更新统计
            updateStatistics(f2Genotype, phenotype);
        }
    });

    // 更新统计数据
    function updateStatistics(genotype, phenotype) {
        // 更新基因型统计
        statistics.genotypes[genotype] = (statistics.genotypes[genotype] || 0) + 1;
        
        // 更新基因型显示
        const genotypeRows = document.querySelectorAll('#genotype-stats-content .stat-row:not(.header-row)');
        genotypeRows.forEach(row => {
            const rowGenotype = row.querySelector('.genotype').textContent.replace(':', '');
            if (rowGenotype) {
                const count = statistics.genotypes[rowGenotype] || 0;
                row.querySelector('.count').textContent = count;
            }
        });
        
        // 更新表型统计
        statistics.phenotypes[phenotype] = (statistics.phenotypes[phenotype] || 0) + 1;
        
        // 更新表型显示
        const phenotypeRows = document.querySelectorAll('#phenotype-stats-content .stat-row:not(.header-row)');
        phenotypeRows.forEach(row => {
            const rowPhenotype = row.querySelector('.phenotype').textContent.replace(':', '');
            if (rowPhenotype) {
                const count = statistics.phenotypes[rowPhenotype] || 0;
                row.querySelector('.count').textContent = count;
            }
        });

        // 立即更新比值
        updateRatios();
    }

    // 更新比值
    function updateRatios() {
        // 更新基因型比值
        const yyrrCount = statistics.genotypes['yyrr'] || 1; // 避免除以0
        const genotypeRows = document.querySelectorAll('#genotype-stats-content .stat-row');
        genotypeRows.forEach(row => {
            const genotype = row.querySelector('.genotype')?.textContent.replace(':', '');
            if (genotype && !row.classList.contains('header-row')) {
                const count = statistics.genotypes[genotype] || 0;
                const ratio = (count / yyrrCount).toFixed(2);
                row.querySelector('.ratio').textContent = ratio;
            }
        });

        // 更新表型比值
        const greenWrinkledCount = statistics.phenotypes['绿皱'] || 1; // 避免除以0
        const phenotypeRows = document.querySelectorAll('#phenotype-stats-content .stat-row');
        phenotypeRows.forEach(row => {
            const phenotype = row.querySelector('.phenotype')?.textContent.replace(':', '');
            if (phenotype && !row.classList.contains('header-row')) {
                const count = statistics.phenotypes[phenotype] || 0;
                const ratio = (count / greenWrinkledCount).toFixed(2);
                row.querySelector('.ratio').textContent = ratio;
            }
        });
    }

    // 单次模拟
    function singleSimulation() {
        document.getElementById('female-gamete-btn').click();
        document.getElementById('male-gamete-btn').click();
        document.getElementById('fertilization-btn').click();
    }

    // 多次模拟
    function multipleSimulations(times) {
        for (let i = 0; i < times; i++) {
            singleSimulation();
        }
    }

    // 绑定模拟按钮事件
    document.getElementById('single-sim').addEventListener('click', () => singleSimulation());
    document.getElementById('sim-10').addEventListener('click', () => multipleSimulations(10));
    document.getElementById('sim-100').addEventListener('click', () => multipleSimulations(100));
    document.getElementById('sim-1000').addEventListener('click', () => multipleSimulations(1000));

    // 统计结果
    document.getElementById('stats-btn').addEventListener('click', updateRatios);

    // 清空按钮
    document.getElementById('clear-btn').addEventListener('click', () => {
        // 重置统计数据
        statistics = { genotypes: {}, phenotypes: {} };
        
        // 清空所有基因型统计行
        document.querySelectorAll('#genotype-stats-content .stat-row:not(.header-row)').forEach(row => {
            row.querySelector('.count').textContent = '0';
            row.querySelector('.ratio').textContent = '0.00';
        });
        
        // 清空所有表型统计行
        document.querySelectorAll('#phenotype-stats-content .stat-row:not(.header-row)').forEach(row => {
            row.querySelector('.count').textContent = '0';
            row.querySelector('.ratio').textContent = '0.00';
        });
        
        // 清空实验区域的所有显示框
        const elementsToReset = [
            'female-y-box', 'female-r-box',
            'male-y-box', 'male-r-box',
            'female-gamete', 'male-gamete',
            'f2-result', 'phenotype-result'
        ];
        
        elementsToReset.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '';
        });
    });

    console.log('All event listeners attached');
}); 