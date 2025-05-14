import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './TodoBoard.css';

const API_BASE = 'http://localhost:8080';

const fetchTodosByTeam = async (teamId) => {
  const response = await fetch(`${API_BASE}/todos/team/${teamId}/by-category`);
  if (!response.ok) throw new Error('할 일 목록 불러오기 실패');
  return response.json();
};

const TodoBoard = ({ teamId, userId }) => {
  const queryClient = useQueryClient();
  const [popupCatId, setPopupCatId] = useState(null);
  const [newTodo, setNewTodo] = useState({ title: '', content: '', date: '' });

  const { data: menuItems, isLoading, error } = useQuery({
    queryKey: ['todos', teamId],
    queryFn: () => fetchTodosByTeam(teamId),
  });

  const handleOpenPopup = (catId) => {
    setPopupCatId(catId);
    setNewTodo({ title: '', content: '', date: '' });
  };

  const handleClosePopup = () => {
    setPopupCatId(null);
  };

  const handleChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = async () => {
    const requestBody = {
      catId: popupCatId,
      teamId,
      creatorId: userId,
      assigneeId: userId,
      todoTitle: newTodo.title,
      todoDes: newTodo.content,
      dueDate: newTodo.date,
      fileForm: null,
      uploadedFilePath: null,
    };

    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('서버 오류');

      await queryClient.invalidateQueries(['todos', teamId]);
      handleClosePopup();
    } catch (err) {
      console.error('❌ 할 일 등록 실패:', err);
    }
  };

  const toggleTodoChecked = async (todoId, checked) => {
    try {
      const response = await fetch(`${API_BASE}/todos/${todoId}/check`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoChecked: checked }),
      });

      if (!response.ok) throw new Error('체크 상태 변경 실패');

      await queryClient.invalidateQueries(['todos', teamId]);
    } catch (err) {
      console.error('✅ 상태 변경 실패:', err);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div className="todo-board">
      {menuItems.map((item) => (
        <div key={item.catId} className="category-box">
          <h3 className="category-title">{item.categoryName}의 할 일</h3>

          <div className="todo-list">
            {(item.todos || []).map((todo) => (
              <div key={todo.todoId} className="todo-row">
                <input
                type="checkbox"
                className='todo-checkbox'
                checked={todo.todoChecked}
                onChange={(e)=>toggleTodoChecked(todo.todoId, e.target.checked)}
                />
                <div className={`todo-card ${todo.todoChecked ?'done' : ''}`}>
                  <div className = 'todo-header'>
                    <span className="todo-title">{todo.todoTitle}</span>
                    <span className="todo-date">{todo.dueDate}</span>
                  </div>
                  <div className = 'todo-content'>{todo.todoDes}</div>
                </div>
              </div>
            ))}
            </div>

          <button className="add-todo-btn" onClick={() => handleOpenPopup(item.catId)}>+</button>
        </div>
      ))}

      {popupCatId && (
        <div className="todo-popup-overlay">
          <div className="todo-popup">
            <h3>할 일 추가</h3>
            <input name="title" placeholder="제목" value={newTodo.title} onChange={handleChange} />
            <textarea name="content" placeholder="내용" value={newTodo.content} onChange={handleChange} />
            <input name="date" type="date" value={newTodo.date} onChange={handleChange} />
            <div className="popup-buttons">
              <button onClick={handleAddTodo}>등록</button>
              <button onClick={handleClosePopup}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoBoard;
