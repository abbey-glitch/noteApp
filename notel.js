window.onload = function(){
    let notes = localStorage.getItem("notes")
    if(notes == null || notes == undefined){
        let info = document.querySelector('.info');
        info.innerText = 'You have no note at the moment'
        info.style.backgroundColor = 'red';
    }else{
        notes = JSON.parse(notes);
        let notes_count = notes.length;
        if(notes_count == 1){
            let info = document.querySelector('.info');
            info.innerText = `You have ${notes_count} note`;
            info.style.backgroundColor = 'pink';
        }else{
            let info = document.querySelector('.info');
            info.innerText = `You have ${notes_count} notes`;
            info.style.backgroundColor = 'pink';
        }
        let noteBody = document.getElementById('noteBody')


        //display notes
        let noteCode = "";
        for(let i=0; i < notes_count; i++){
            note = JSON.parse(notes[i]); 
            noteCode += `<div class="title">
                              <h3>TITLE:</h3><input type="text" value="${note['title']}">  
                         </div>`
            let noteContent = note['content'];
            if(noteContent.length > 60){
                noteContent = noteContent.substr(0, 61);
                let note_string = JSON.stringify(note)
                noteContent += `<br/><strong><a href="#" onclick='openNote(${note_string})'>...Read More</a></strong>`
            }
            noteCode += `<div class="note">
                                  <h3>CONTENT:</h3> ${noteContent}                                             
                        </div>`
            noteCode += ` <div class="author">
                                   <h3>AUTHOR</h3><input type="text" value="${note['author']}">
                            </div>`
            noteCode += `<div class="buttons">
                                   <button type="button" class="save" onclick="updateNote(${note['time_created']})">update</button>
                                   <span class="saveInfo"></span>
                                   <button type="button" class="delete" onclick="deleteNote(${note['time_created']})">Delete</button>
                         </div>`
                           
        }
        noteBody.innerHTML = noteCode;
    }
}
function openNote(note_string){
    note_string = JSON.stringify(note_string);
    console.log(note_string);
    //save
    localStorage.setItem('readNote', note_string);
    //goto
    location.href = 'open.html';
}

function deleteNote(timestamp){
    let notes = localStorage.getItem("notes");
        notes = JSON.parse(notes);
        for(let i = 0; i < notes.length; i++){
            note = JSON.parse(notes[i]);
            if(note['time_created'] == timestamp){
                //this is the note
                notes.splice(i, 1);
                //save the note
                notes = JSON.stringify(notes)
                localStorage.setItem('notes', notes);
                //reload the page
                location.reload();
            }
        }
}

function updateNote(timestamp){
    let notes = localStorage.getItem("notes");
    notes = JSON.parse(notes);
    let edit = "";
    for(let i = 0; i < notes.length; i++){
        note = JSON.parse(notes[i]);
        if(note['time_created'] == timestamp){
            //this is the note
            edit += `<div class="title">
                              <h3>TITLE:</h3><input type="text" id="newTitle" value="${note['title']}">  
                         </div>
                        <div class="note">
                                <h3>CONTENT:</h3><textarea id="newContent"> ${note['content']}
                                </textarea>                                             
                        </div>
                        <div class="author">
                             <h3>AUTHOR</h3><input type="text" id="newAuthor" value="${note['author']}">
                         </div>
                        <div class="buttons">
                                <button type="button" id="saveUpdate${timestamp}">Save</button>
                                <span class="saveInfo"></span>
                        </div><hr/>`
          
        }
    }  
    document.querySelector('#update').innerHTML = edit;   

    console.log(timestamp);

    document.querySelector("#saveUpdate"+timestamp).addEventListener('click', function(){
            let newTitle = document.getElementById('newTitle').value;
            let newContent = document.getElementById('newContent').value;
            let newAuthor = document.getElementById('newAuthor').value;
            newTitle = newTitle.trim();
            newContent = newContent.trim();
            newAuthor = newAuthor.trim();
            if(newTitle.length == 0 || newContent.length == 0 || newAuthor.length == 0){
                let info = document.querySelector('.info');
                info.innerText = 'empty note can not be updated!'
            }else{
                let date = new Date();
                let date_updated = date.getTime();
                let notes = localStorage.getItem('notes');
                notes = JSON.parse(notes);
                for(let i=0; i < notes.length; i++){
                    note = JSON.parse(notes[i]);
                    if(note['time_created'] == timestamp){
                        note['date_updated'] = date_updated;
                        note['title'] = newTitle;
                        //change the content
                        note['content'] = newContent;
                        //change the author
                        note['author'] = newAuthor;
                        //single stringification
                        note = JSON.stringify(note)
                        //make the changes global
                        notes[i] = note;
                        //save changes
                        notes = JSON.stringify(notes)
                        localStorage.setItem("notes", notes);
                        let info =  document.querySelector('.info');
                        info.innerText = 'updated successful!'
                        //reload
                        location.reload();
                    }
                }
            }
     }) 
}