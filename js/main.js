$(document).ready(function(){
  getTasks();
  getCategories();
  getCategoryOptions();

  $('#add_task').on('submit', addTask);
  $('#edit_task').on('submit', editTask);

  $('body').on('click', '.btn-edit-task', setTask);
  $('body').on('click', '.btn-delete-task', deleteTask);

  $('#add_category').on('submit', addCategory);
  $('#edit_category').on('submit', editCategory);

  $('body').on('click', '.btn-edit-category', setCategory);
  $('body').on('click', '.btn-delete-category', deleteCategory);
});

const apiKey = 'edJcwtJtlxoRmH3vvdnOcmqdnpyvUjqJ';

function getTasks(){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey='+apiKey, function(data){
    var output = '<ul class="list-group">';
    $.each(data, function(key, task){
      output += '<li class="list-group-item">';
      output += task.task_name+'<span class="due_on">[Due on '+task.due_date+']</span>'
      if(task.is_urget == "true"){
        output += '<span class="label label-danger">Urgent</span>'
      }
      output += '<div class="pull-right"><a class="btn btn-primary btn-edit-task" data-task-name="'+task.task_name+'" data-task-id="'+task._id.$oid+'">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="'+task._id.$oid+'">Delete</a></div>';
    });
    output += '</ul>';
    $('#tasks').html(output);
  });
}

function addTask(e){
  var task_name = $('#task_name').val();
  var category = $('#category').val();
  var due_date = $('#due_date').val();
  var is_urgent = $('#is_urgent').val();

  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey='+apiKey,
    data: JSON.stringify({
      "task_name": task_name,
      "category": category,
      "due_date": due_date,
      "is_urgent": is_urgent
    }),
    type:'POST',
    contentType:'application/json',
    success: function(data){
      window.location.href='index.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
}

function setTask(){
  var task_id = $(this).data('task-id');
  sessionStorage.setItem('current_id', task_id);
  window.location.href='edittask.html';
  return false;
}

function getTask(id){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/'+id+'?apiKey='+apiKey, function(task){
    $('#task_name').val(task.task_name);
    $('#category').find(task.category).attr("selected", true)
    $('#due_date').val(task.due_date);
    $('#is_urgent').val(task.is_urgent);
  });
}

function editTask(e){
  var task_id= sessionStorage.getItem('current_id');
  var task_name = $('#task_name').val();
  var category = $('#category').val();
  var due_date = $('#due_date').val();
  var is_urgent = $('#is_urgent').val();
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/'+task_id+'?apiKey='+apiKey,
    data: JSON.stringify({
      "task_name": task_name,
      "category": category,
      "due_date": due_date,
      "is_urgent": is_urgent
    }),
    type:'PUT',
    contentType:'application/json',
    success: function(data){
      window.location.href='index.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
}

function deleteTask(){
  var task_id = $(this).data('task-id');
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/'+task_id+'?apiKey='+apiKey,
    type:'DELETE',
    async: true,
    contentType:'application/json',
    success: function(data){
      window.location.href='index.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
}

function getCategoryOptions(){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey, function(data){
    var output;
    $.each(data, function(key, category){
      output += '<option value="'+category.category_name+'">'+category.category_name+'</option>';
    });
    output += '</ul>';
    $('#category').append(output);
  });
}

function getCategories(){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey, function(data){
    var output = '<ul class="list-group">';
    $.each(data, function(key, category){
      output += '<li class="list-group-item">';
      output += category.category_name;
      output += '<div class="pull-right"><a class="btn btn-primary btn-edit-category" data-category-name="'+category.category_name+'" data-category-id="'+category._id.$oid+'">Edit</a> <a class="btn btn-danger btn-delete-category" data-category-id="'+category._id.$oid+'">Delete</a></div>';
    });
    output += '</ul>';
    $('#categories').html(output);
  });
}

function addCategory(e){
  var category_name = $('#category_name').val();

  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey='+apiKey,
    data: JSON.stringify({
      "category_name": category_name
    }),
    type:'POST',
    contentType:'application/json',
    success: function(data){
      window.location.href='categories.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
}

function setCategory(){
  var category_id = $(this).data('category-id');
  sessionStorage.setItem('current_id', category_id);
  window.location.href='editcategory.html';
  return false;
}

function getCategory(id){
  $.get('https://api.mlab.com/api/1/databases/taskmanager/collections/categories/'+id+'?apiKey='+apiKey, function(category){
    $('#category_name').val(category.category_name);
  });
}

function editCategory(e){
  var category_id= sessionStorage.getItem('current_id');
  var category_name = $('#category_name').val();
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/categories/'+category_id+'?apiKey='+apiKey,
    data: JSON.stringify({
      "category_name": category_name
    }),
    type:'PUT',
    contentType:'application/json',
    success: function(data){
      window.location.href='categories.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
  e.preventDefault();
}

function deleteCategory(){
  var category_id = $(this).data('category-id');
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/taskmanager/collections/categories/'+category_id+'?apiKey='+apiKey,
    type:'DELETE',
    async: true,
    contentType:'application/json',
    success: function(data){
      window.location.href='categories.html';
    },
    error: function(xhr, status, err){
      console.log(err);
    }
  });
}
