window.addEventListener('Load', () => {
    console.log('hej världen');

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            console.log(e.target.checked);
            const id = e.target.id.split("-")[1];

            const url = '/tasks/${id}/complete';

            fetch(url, {
                method: 'POST'   
            }).then(response => {
                console.log(response);
            }).catch(error => {
                console.error(error);
            });
        });
    });
});